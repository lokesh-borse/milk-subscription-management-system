#!/bin/bash

echo "Starting Django backend..."

cd milkman
source ../venv/Scripts/activate
python manage.py runserver 0.0.0.0:8000 &

cd ..

echo "Starting React User frontend..."

cd ./reactuser
npm run dev &

cd ..

echo "Starting React Admin frontend..."

cd ./reactadmin
npm run dev
