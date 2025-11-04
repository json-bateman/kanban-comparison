#!/bin/bash

# Exit on error
set -e

# Cleanup function to ensure dev server is killed
cleanup() {
  if [ ! -z "$DEV_PID" ]; then
    echo "Shutting down dev server (PID: $DEV_PID)..."
    kill $DEV_PID 2>/dev/null || true
    wait $DEV_PID 2>/dev/null || true
  fi
}

# Register cleanup function to run on exit
trap cleanup EXIT

echo "Starting dev server..."
npm run dev > /dev/null 2>&1 &
DEV_PID=$!

echo "Waiting for dev server to be ready..."
MAX_ATTEMPTS=30
ATTEMPT=0
until curl -s http://localhost:8788 > /dev/null 2>&1; do
  ATTEMPT=$((ATTEMPT + 1))
  if [ $ATTEMPT -ge $MAX_ATTEMPTS ]; then
    echo "Error: Dev server failed to start after ${MAX_ATTEMPTS} seconds"
    exit 1
  fi
  sleep 1
done

echo "Dev server is ready!"

echo "Running migration..."
curl -X POST http://localhost:8788/api/migrate
echo ""

echo "Seeding database with sample data..."
curl -X POST http://localhost:8788/api/seed
echo ""

echo ""
echo "Database setup complete!"
