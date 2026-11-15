FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    APP_ROOT=/frontend \
    CATALOG_PATH=/content/catalog.json \
    DATABASE_PATH=/data/progress.sqlite3 \
    HOST=0.0.0.0 \
    PORT=8080

WORKDIR /app
COPY backend/server.py /app/server.py
COPY frontend/ /frontend/
COPY content/catalog.json /content/catalog.json
EXPOSE 8080
CMD ["python", "/app/server.py"]
