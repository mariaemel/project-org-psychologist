#!/bin/sh
set -e

# Defaults for local runs
: "${SQLITE_PATH:=/data/db.sqlite3}"
: "${MEDIA_ROOT:=/data/media}"
: "${STATIC_ROOT:=/data/staticfiles}"

mkdir -p "$(dirname "$SQLITE_PATH")" "$MEDIA_ROOT" "$STATIC_ROOT"

# Seed initial sqlite DB if volume is empty (optional, keeps your demo data)
if [ ! -f "$SQLITE_PATH" ] && [ -f "/app/db.sqlite3" ]; then
  echo "Seeding SQLite DB to $SQLITE_PATH"
  cp /app/db.sqlite3 "$SQLITE_PATH"
fi

# Seed media folder if empty and repo has media
if [ ! -d "$MEDIA_ROOT" ] || [ -z "$(ls -A "$MEDIA_ROOT" 2>/dev/null)" ]; then
  if [ -d "/app/media" ]; then
    echo "Seeding media to $MEDIA_ROOT"
    cp -r /app/media/. "$MEDIA_ROOT" 2>/dev/null || true
  fi
fi

python manage.py migrate --noinput
python manage.py collectstatic --noinput || true

# Start server
exec gunicorn orgPsych.wsgi:application \
  --bind 0.0.0.0:8000 \
  --workers "${GUNICORN_WORKERS:-3}" \
  --threads "${GUNICORN_THREADS:-2}" \
  --timeout "${GUNICORN_TIMEOUT:-120}"
