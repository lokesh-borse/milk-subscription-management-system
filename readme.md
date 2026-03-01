## Project Overview

This repository contains a multi-part fullstack project used for the "New Day" demo/workshop. It includes:

- a Django monorepo under `milkman/` (backend API, apps like `staff`, `product`, `customer`, `subscription`, etc.)
- separate Node/Express or static admin frontends under `adminpanel/`, `newadmin/`, `reactadmin/`, and `reactuser/`
- a small `frontend/` server for static assets

The Django app uses `db.sqlite3` by default for development.

## Repo Structure (high level)

- `milkman/` — Django project (settings, apps, `manage.py`) and `db.sqlite3` in repo root
- `adminpanel/` — legacy admin UI (Node/Express)
- `backend/` — additional backend service and templates
- `frontend/` — simple frontend server and static site
- `newadmin/`, `reactadmin/`, `reactuser/` — Vite + React admin/user frontends

## Requirements

- Python 3.8+ (recommended 3.10+)
- Node.js 16+ and `npm` or `yarn`
- (Optional) `virtualenv` or `venv` for isolating Python deps

## Setup — Django (`milkman`)

1. Create and activate a Python virtual environment:

   - On Windows (PowerShell): `python -m venv .venv` then `.
.venv\Scripts\Activate.ps1`
   - On macOS/Linux: `python3 -m venv .venv` then `source .venv/bin/activate`

2. Install Python dependencies (add your requirements to `requirements.txt` if needed):

   - `pip install django djangorestframework`

3. Run migrations and start the Django dev server from the `milkman/` directory:

   - `cd milkman`
   - `python manage.py migrate`
   - `python manage.py runserver`

4. The API will be available at `http://127.0.0.1:8000/` by default.

Notes:
- If you need to create an app, use `python manage.py startapp <appname>` (e.g. `staff`).
- Add apps to `INSTALLED_APPS` in `milkman/settings.py` and register URLs in `milkman/urls.py`.

## Setup — Node/React frontends

Each frontend (`newadmin`, `reactadmin`, `reactuser`, `adminpanel`, `backend/frontend`) is an independent Node project. Typical steps:

1. Install dependencies:

   - `cd reactadmin` (or other frontend folder)
   - `npm install` or `yarn`

2. Run the dev server (Vite projects):

   - `npm run dev` or `yarn dev`

3. Build for production:

   - `npm run build`

Adjust frontend API base URLs in `src/services/api.js` or environment files to point at the running Django API.

## Database

- Development uses the included `db.sqlite3` (located in repo root). For production, switch to PostgreSQL or another DB and update `milkman/settings.py`.

## Tests

- Django tests: `cd milkman` then `python manage.py test`
- Frontend tests depend on each project setup (Jest/Vitest) — check the respective `package.json`.

## Common Tips

- To add a serializer: create `serializers.py` in the app (e.g. `staff/serializers.py`).
- To add app routes: create `urls.py` in the app and `include` them from `milkman/urls.py`:

  ```python
  from django.urls import path, include

  urlpatterns = [
      path('api/staff/', include('staff.urls')),
  ]
  ```

## Contributing

- Follow typical Git workflow: branch, commit, open PR. Add clear notes about database migrations or seed data.

## License & Contact

- Add your preferred license file (e.g., `LICENSE`).
- For project questions, contact the repo owner or check internal docs.

---

If you'd like, I can:

- add a `requirements.txt` and a `Makefile`/`scripts` for common commands,
- add environment examples (`.env.example`) for frontend and backend,
- or update any specific frontend's `package.json` scripts to standardize start/build commands.

