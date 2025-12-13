#!/usr/bin/env bash
set -o errexit

echo "======================================"
echo "Building React Frontend..."
echo "======================================"
cd frontend
npm install
npm run build
cd ..

echo "======================================"
echo "Installing Python Dependencies..."
echo "======================================"
pip install -r backend/requirements.txt

echo "======================================"
echo "Collecting Static Files..."
echo "======================================"
cd backend
python manage.py collectstatic --no-input

echo "======================================"
echo "Running Migrations..."
echo "======================================"
python manage.py migrate

echo "======================================"
echo "Build Complete!"
echo "======================================"
