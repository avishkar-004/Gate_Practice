FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    APP_ROOT=/app \
    DATABASE_PATH=/data/progress.sqlite3 \
    HOST=0.0.0.0 \
    PORT=8080

WORKDIR /app
COPY server.py index.html styles.css app.js catalog.json /app/
EXPOSE 8080
CMD ["python", "/app/server.py"]
