# GATE CSE Syllabus (GATE 2027)

The GATE paper is officially titled **Computer Science and Information Technology (CS)**.

- **Total:** 100 marks
- **General Aptitude:** 15 marks
- **CS syllabus:** 85 marks

## 1. Engineering Mathematics

- **Discrete Mathematics:** Propositional and first-order logic; sets, relations, functions, partial orders and lattices; monoids and groups; graph connectivity, matching and colouring; counting, recurrence relations and generating functions.
- **Linear Algebra:** Matrices, determinants, systems of linear equations, eigenvalues and eigenvectors, LU decomposition.
- **Calculus:** Limits, continuity and differentiability, maxima and minima, mean value theorem, integration.
- **Probability and Statistics:** Random variables; uniform, normal, exponential, Poisson and binomial distributions; mean, median, mode and standard deviation; conditional probability and Bayes' theorem.

## 2. Digital Logic

Boolean algebra and minimization (algebraic technique, Karnaugh map, tabular method); design of combinational and sequential circuits; number representation and arithmetic (fixed and floating point).

## 3. Computer Organization and Architecture

Instruction set and addressing modes; design of arithmetic and logic unit (ALU); hardwired and microprogrammed control units; memory interfacing and hierarchy, performance and cache memory mapping; I/O interface (interrupt and DMA); instruction pipelining and pipeline hazards.

## 4. Programming and Data Structures

Programming in C; recursion; arrays, stacks, queues, linked lists, trees, binary search trees, binary heaps and graphs.

## 5. Algorithms

Searching, sorting and hashing; asymptotic worst-case time and space complexity; greedy, dynamic programming and divide-and-conquer techniques; graph traversals, minimum spanning trees and shortest paths.

## 6. Theory of Computation

Regular expressions and finite automata; context-free grammars and push-down automata; regular and context-free languages; pumping lemma; Turing machines and undecidability.

## 7. Compiler Design

Lexical analysis, parsing and syntax-directed translation; runtime environments; intermediate code generation; local optimization; data-flow analyses including constant propagation, liveness analysis and common subexpression elimination.

## 8. Operating Systems

System calls, processes, threads, inter-process communication, concurrency and synchronization; deadlock; CPU and I/O scheduling; memory management and virtual memory; file systems.

## 9. Databases

ER model; relational model, relational algebra, tuple calculus and SQL; integrity constraints and normal forms; file organization and indexing (e.g., B and B+ trees); transactions and concurrency control.

## 10. Computer Networks

Principles of layering; basics of switching (circuit, packet and virtual circuit) and performance metrics; data link layer (error detection, Medium Access Control, Ethernet); distance-vector and link-state routing; IPv4 (fragmentation, CIDR notation, Network Address Translation); TCP (flow control and congestion control), socket API; DNS and HTTP.

## General Aptitude

General Aptitude is a common 15-mark component of the GATE paper. Refer to the official syllabus for its detailed topics.

## Official reference

- [GATE 2027 CS syllabus PDF](https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/CS_GATE2027_Syllabus.pdf)
- [GATE 2027 test papers and syllabus page](https://gate2027.iitm.ac.in/exam_papers_and_syllabus)

## GATE CS Practice Lab

The app contains four subjects: **Programming and Data Structures**, **Algorithms**, **Computer Networks**, and **Computer Organization and Architecture**. The current bank has 100 records per topic (3,000 records across 30 topics), but many were produced from a small set of parameterized templates. The count does not represent 3,000 independently designed problems, and this legacy bank should not be treated as a complete GATE preparation resource. Topic banks are being replaced with original, varied questions and worked explanations; only a complete authored topic bank should be counted as rebuilt.

## Run with Docker

Install Docker Desktop or Docker Engine with the Compose plugin, then from the project directory run:

```sh
docker compose up
```

Open [http://localhost:8081](http://localhost:8081). Compose starts the frontend and backend together. Subjects, topics and all questions are seeded into SQLite and served to the frontend by the API. Checked answers are global database state: every tab polls the same state, so a checked answer appears in other open tabs as well as after a browser reload.

The SQLite file is stored in the named Docker volume `gate_practice_data`. `docker compose down` stops the app while keeping the database. Removing the volume (for example, `docker compose down -v`) deletes the database and all checked status. If port 8081 is occupied, set `GATE_PRACTICE_PORT` to another host port before starting.

## Project structure and adding subjects

Each subject is a self-contained package under `content/subjects/` with its own `subject.json` and question source. The catalog builder discovers these folders automatically; no central subject list needs editing.

To add a subject, copy `templates/subject` to `content/subjects/<subject-slug>`, edit the manifest and `questions.json`, then run:

```sh
node tools/build_catalog.js
```

The builder validates question types, IDs, explanations and the 100–150 question count for every topic, then writes `content/catalog.json`. The backend imports catalog changes on its next API request. See [templates/README.md](templates/README.md) for the question format and the optional generated-bank format.

Frontend files are in `frontend/`; the SQLite API is in `backend/server.py`; database content sources and the generated catalog are in `content/`; build tools are in `tools/`. Frontend edits are bind-mounted into Docker, while Python backend edits require `docker compose up --build`.

- `frontend/index.html`, `frontend/styles.css`, `frontend/app.js` — browser application
- `backend/server.py` — static file server, catalog seeding and SQLite API
- `content/subjects/` — independently maintained subject packages
- `content/catalog.json` — generated SQLite seed
- `tools/build_catalog.js` — subject discovery, validation and catalog generation
- `templates/subject/` — starter package for adding a subject
- `Dockerfile` and `compose.yaml` — single-command container setup
