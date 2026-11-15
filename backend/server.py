"""HTTP API and static server for the GATE CS practice application."""

from __future__ import annotations

import json
import os
import sqlite3
import threading
from contextlib import closing
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit


APP_ROOT = Path(os.environ.get("APP_ROOT", "/frontend"))
CATALOG_FILE = Path(os.environ.get("CATALOG_PATH", "/content/catalog.json"))
DATABASE_PATH = Path(os.environ.get("DATABASE_PATH", "/data/progress.sqlite3"))
HOST = os.environ.get("HOST", "0.0.0.0")
PORT = int(os.environ.get("PORT", "8080"))
STATIC_FILES = {"/": "index.html", "/index.html": "index.html", "/styles.css": "styles.css", "/app.js": "app.js"}
CATALOG_SIGNATURE = None
CATALOG_LOCK = threading.Lock()


def connect_db() -> sqlite3.Connection:
    DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(DATABASE_PATH, timeout=15)
    db.row_factory = sqlite3.Row
    db.execute("PRAGMA foreign_keys = ON")
    db.execute("PRAGMA busy_timeout = 15000")
    return db


def catalog_path() -> Path:
    if CATALOG_FILE.is_file():
        return CATALOG_FILE
    return Path(__file__).resolve().parent.parent / "content" / "catalog.json"


def parse_numeric_answer(value: object) -> float:
    """Parse decimal NAT input and explicit 0x-prefixed hexadecimal input."""
    normalized = str(value).replace(",", "").strip()
    try:
        return float(normalized)
    except ValueError:
        return float(int(normalized, 0))


def initialize_db() -> None:
    with closing(connect_db()) as db:
        db.execute("PRAGMA journal_mode = WAL")
        db.executescript(
            """
            CREATE TABLE IF NOT EXISTS subjects (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                short_name TEXT NOT NULL,
                description TEXT NOT NULL,
                position INTEGER NOT NULL
            );
            CREATE TABLE IF NOT EXISTS topics (
                id TEXT PRIMARY KEY,
                subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
                title TEXT NOT NULL,
                subtitle TEXT NOT NULL,
                icon TEXT NOT NULL,
                position INTEGER NOT NULL
            );
            CREATE TABLE IF NOT EXISTS questions (
                id TEXT PRIMARY KEY,
                subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
                topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
                type TEXT NOT NULL CHECK (type IN ('MCQ', 'MSQ', 'NAT')),
                difficulty TEXT NOT NULL,
                prompt TEXT NOT NULL,
                options_json TEXT NOT NULL,
                answer_json TEXT NOT NULL,
                explanation TEXT NOT NULL,
                position INTEGER NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_questions_topic_position
                ON questions(topic_id, position);
            CREATE TABLE IF NOT EXISTS checked_status (
                question_id TEXT PRIMARY KEY REFERENCES questions(id) ON DELETE CASCADE,
                response_json TEXT NOT NULL,
                correct INTEGER NOT NULL CHECK (correct IN (0, 1)),
                checked_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            """
        )
        db.commit()
    sync_catalog(force=True)
    migrate_legacy_progress()


def sync_catalog(force: bool = False) -> None:
    """Seed/update the database from the checked-in catalog JSON."""
    global CATALOG_SIGNATURE
    source = catalog_path()
    stat = source.stat()
    signature = (stat.st_mtime_ns, stat.st_size)
    if not force and signature == CATALOG_SIGNATURE:
        return
    with CATALOG_LOCK:
        stat = source.stat()
        signature = (stat.st_mtime_ns, stat.st_size)
        if not force and signature == CATALOG_SIGNATURE:
            return
        catalog = json.loads(source.read_text(encoding="utf-8"))
        with closing(connect_db()) as db:
            with db:
                db.execute("CREATE TEMP TABLE IF NOT EXISTS incoming_subjects(id TEXT PRIMARY KEY)")
                db.execute("CREATE TEMP TABLE IF NOT EXISTS incoming_topics(id TEXT PRIMARY KEY)")
                db.execute("CREATE TEMP TABLE IF NOT EXISTS incoming_questions(id TEXT PRIMARY KEY)")
                db.execute("DELETE FROM incoming_subjects")
                db.execute("DELETE FROM incoming_topics")
                db.execute("DELETE FROM incoming_questions")
                for subject_position, subject in enumerate(catalog["subjects"]):
                    db.execute("INSERT INTO incoming_subjects(id) VALUES(?)", (subject["id"],))
                    db.execute(
                        """INSERT INTO subjects(id,title,short_name,description,position)
                           VALUES(?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET
                           title=excluded.title, short_name=excluded.short_name,
                           description=excluded.description, position=excluded.position""",
                        (subject["id"], subject["title"], subject["short"], subject["description"], subject_position),
                    )
                    for topic in subject["topics"]:
                        db.execute("INSERT INTO incoming_topics(id) VALUES(?)", (topic["id"],))
                        db.execute(
                            """INSERT INTO topics(id,subject_id,title,subtitle,icon,position)
                               VALUES(?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET
                               subject_id=excluded.subject_id, title=excluded.title,
                               subtitle=excluded.subtitle, icon=excluded.icon, position=excluded.position""",
                            (topic["id"], subject["id"], topic["title"], topic["subtitle"], topic["icon"], topic["position"]),
                        )
                    for question in subject["questions"]:
                        db.execute("INSERT INTO incoming_questions(id) VALUES(?)", (question["id"],))
                        db.execute(
                            """INSERT INTO questions
                               (id,subject_id,topic_id,type,difficulty,prompt,options_json,answer_json,explanation,position)
                               VALUES(?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET
                               subject_id=excluded.subject_id, topic_id=excluded.topic_id,
                               type=excluded.type, difficulty=excluded.difficulty, prompt=excluded.prompt,
                               options_json=excluded.options_json, answer_json=excluded.answer_json,
                               explanation=excluded.explanation, position=excluded.position""",
                            (
                                question["id"], subject["id"], question["topic_id"], question["type"],
                                question["difficulty"], question["prompt"], json.dumps(question["options"], ensure_ascii=False),
                                json.dumps(question["answer"], ensure_ascii=False), question["explanation"], question["position"],
                            ),
                        )
                db.execute("DELETE FROM questions WHERE id NOT IN (SELECT id FROM incoming_questions)")
                db.execute("DELETE FROM topics WHERE id NOT IN (SELECT id FROM incoming_topics)")
                db.execute("DELETE FROM subjects WHERE id NOT IN (SELECT id FROM incoming_subjects)")
        CATALOG_SIGNATURE = signature


def migrate_legacy_progress() -> None:
    """Merge old browser-scoped attempts into the new shared progress table."""
    with closing(connect_db()) as db:
        exists = db.execute(
            "SELECT 1 FROM sqlite_master WHERE type='table' AND name='answer_progress'"
        ).fetchone()
        if not exists:
            return
        with db:
            db.execute(
                """INSERT INTO checked_status(question_id,response_json,correct,checked_at)
                   SELECT old.question_id,old.response_json,old.correct,old.updated_at
                   FROM answer_progress old JOIN questions q
                     ON q.id=old.question_id AND q.subject_id=old.subject
                   WHERE old.rowid=(
                     SELECT candidate.rowid FROM answer_progress candidate
                     WHERE candidate.subject=old.subject AND candidate.question_id=old.question_id
                     ORDER BY candidate.updated_at DESC,candidate.rowid DESC LIMIT 1
                   )
                   ON CONFLICT(question_id) DO NOTHING"""
            )
            db.execute("DROP TABLE answer_progress")


class Handler(BaseHTTPRequestHandler):
    server_version = "GatePractice/2.0"

    def send_json(self, status: int, payload: dict) -> None:
        body = json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:
        request = urlsplit(self.path)
        if request.path == "/api/health":
            with closing(connect_db()) as db:
                subjects = db.execute("SELECT COUNT(*) FROM subjects").fetchone()[0]
                topics = db.execute("SELECT COUNT(*) FROM topics").fetchone()[0]
                questions = db.execute("SELECT COUNT(*) FROM questions").fetchone()[0]
            self.send_json(200, {"ok": True, "storage": "sqlite", "subjects": subjects, "topics": topics, "questions": questions})
            return
        if request.path == "/api/catalog":
            try:
                sync_catalog()
                self.send_json(200, self.read_catalog())
            except (OSError, ValueError, KeyError, sqlite3.Error) as exc:
                self.send_json(503, {"error": f"Catalog unavailable: {exc}"})
            return
        if request.path == "/api/progress":
            with closing(connect_db()) as db:
                rows = db.execute(
                    """SELECT q.subject_id, q.id AS question_id, q.answer_json, q.explanation,
                              c.response_json, c.correct, c.checked_at
                       FROM checked_status c JOIN questions q ON q.id=c.question_id
                       ORDER BY q.subject_id, q.id"""
                ).fetchall()
            progress = {
                f"{row['subject_id']}:{row['question_id']}": {
                    "response": json.loads(row["response_json"]),
                    "correct": bool(row["correct"]),
                    "checked_at": row["checked_at"],
                    "answer": json.loads(row["answer_json"]),
                    "explanation": row["explanation"],
                }
                for row in rows
            }
            self.send_json(200, {"progress": progress})
            return
        self.serve_static(request.path)

    def read_catalog(self) -> dict:
        with closing(connect_db()) as db:
            subjects = db.execute("SELECT * FROM subjects ORDER BY position").fetchall()
            output = []
            for subject in subjects:
                topics = db.execute(
                    "SELECT * FROM topics WHERE subject_id=? ORDER BY position", (subject["id"],)
                ).fetchall()
                topic_list = []
                for topic in topics:
                    rows = db.execute(
                        "SELECT * FROM questions WHERE topic_id=? ORDER BY position", (topic["id"],)
                    ).fetchall()
                    topic_list.append({
                        "id": topic["id"], "title": topic["title"], "subtitle": topic["subtitle"],
                        "icon": topic["icon"], "questions": [self.question_json(row) for row in rows],
                    })
                output.append({
                    "id": subject["id"], "title": subject["title"], "short": subject["short_name"],
                    "description": subject["description"], "topics": topic_list,
                })
        return {"subjects": output}

    @staticmethod
    def question_json(row: sqlite3.Row) -> dict:
        return {
            "id": row["id"], "type": row["type"], "difficulty": row["difficulty"],
            "prompt": row["prompt"], "options": json.loads(row["options_json"]),
        }

    def do_POST(self) -> None:
        if urlsplit(self.path).path != "/api/progress":
            self.send_json(404, {"error": "Not found"})
            return
        try:
            size = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            size = 0
        if size <= 0 or size > 16_384:
            self.send_json(413, {"error": "Request body must be between 1 and 16384 bytes"})
            return
        try:
            payload = json.loads(self.rfile.read(size))
        except (json.JSONDecodeError, UnicodeDecodeError):
            self.send_json(400, {"error": "Invalid JSON"})
            return
        if not isinstance(payload, dict):
            self.send_json(400, {"error": "Expected a JSON object"})
            return
        subject = payload.get("subject")
        question_id = payload.get("question_id")
        response = payload.get("response")
        if not isinstance(subject, str) or not isinstance(question_id, str) or not question_id or len(question_id) > 96:
            self.send_json(400, {"error": "Invalid subject or question_id"})
            return
        valid_response = isinstance(response, str) and len(response) <= 256
        valid_response = valid_response or (
            isinstance(response, list) and len(response) <= 20
            and all(isinstance(item, str) and len(item) <= 512 for item in response)
        )
        if not valid_response:
            self.send_json(400, {"error": "Invalid response"})
            return

        try:
            with closing(connect_db()) as db:
                row = db.execute(
                    "SELECT subject_id,type,answer_json FROM questions WHERE id=?", (question_id,)
                ).fetchone()
                if row is None or row["subject_id"] != subject:
                    self.send_json(404, {"error": "Question not found for subject"})
                    return
                expected = json.loads(row["answer_json"])
                if row["type"] == "NAT":
                    try:
                        actual_number = parse_numeric_answer(response)
                        expected_number = parse_numeric_answer(expected)
                        correct = abs(actual_number - expected_number) <= 1e-6 * max(1.0, abs(expected_number))
                    except (ValueError, AttributeError):
                        correct = False
                else:
                    correct = (
                        isinstance(response, list)
                        and len(response) == len(expected)
                        and set(response) == set(expected)
                    )
                with db:
                    db.execute(
                        """INSERT INTO checked_status(question_id,response_json,correct,checked_at)
                           VALUES(?,?,?,CURRENT_TIMESTAMP)
                           ON CONFLICT(question_id) DO UPDATE SET
                           response_json=excluded.response_json, correct=excluded.correct,
                           checked_at=CURRENT_TIMESTAMP""",
                        (question_id, json.dumps(response, ensure_ascii=False), int(correct)),
                    )
        except sqlite3.Error:
            self.send_json(503, {"error": "Database write failed"})
            return
        self.send_json(200, {"ok": True})

    def serve_static(self, path: str) -> None:
        filename = STATIC_FILES.get(path)
        if filename is None:
            self.send_json(404, {"error": "Not found"})
            return
        file_path = APP_ROOT / filename
        if not file_path.is_file():
            file_path = Path(__file__).resolve().parent.parent / "frontend" / filename
        if not file_path.is_file():
            self.send_json(404, {"error": "Static file not found"})
            return
        content = file_path.read_bytes()
        content_type = "text/css" if filename.endswith(".css") else "text/html" if filename.endswith(".html") else "text/javascript"
        self.send_response(200)
        self.send_header("Content-Type", f"{content_type}; charset=utf-8")
        self.send_header("Content-Length", str(len(content)))
        self.send_header("Cache-Control", "no-cache")
        self.end_headers()
        self.wfile.write(content)

    def log_message(self, fmt: str, *args) -> None:
        print(f"{self.address_string()} - {fmt % args}")


if __name__ == "__main__":
    initialize_db()
    httpd = ThreadingHTTPServer((HOST, PORT), Handler)
    print(f"GATE CS Practice Lab listening on http://{HOST}:{PORT}", flush=True)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        httpd.server_close()
