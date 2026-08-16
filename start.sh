#!/usr/bin/env bash
set -euo pipefail

export PORT="${PORT:-8088}"
export SERVER_PORT="${PORT}"
export REDIS_HOST="${REDIS_HOST:-localhost}"
export REDIS_PORT="${REDIS_PORT:-6379}"

if [ -f "backend/mvnw" ]; then
  chmod +x backend/mvnw
fi

cd backend
exec ./mvnw spring-boot:run
