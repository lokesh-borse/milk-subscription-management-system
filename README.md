# Milkman - Current Project Stage

Last updated: 2026-03-08

Milkman is a three-part full-stack project:

- `milkman/` - Django REST backend
- `reactuser/` - customer-facing React app
- `reactadmin/` - staff/admin React app

## Current Status

- Backend APIs are functional for auth, catalog, subscriptions, and image upload.
- `reactuser` is largely integrated and uses modern UI components and Framer Motion.
- `reactadmin` has dashboard + sidebar integrated, but resource pages still use basic tables.
- `reactadmin/src/components/DataTable.jsx` exists but is not yet wired into resource pages.

## Tech Stack

- Backend: Django, Django REST Framework, SQLite, `django-cors-headers`
- Frontend: React 19 + Vite, React Router, Axios
- UI libs: Bootstrap, Lucide React, Recharts, Framer Motion

## Project Structure

```text
daytwo/
  milkman/
  reactuser/
  reactadmin/
```

## Quick Setup

### Backend

```bash
cd milkman
pip install django djangorestframework django-cors-headers
python manage.py migrate
python manage.py seed_catalog
python manage.py runserver
```

Backend runs at `http://localhost:8000`.

### User App

```bash
cd reactuser
npm install
npm run dev
```

API base URL is dynamic by default: `http(s)://<current-host>:8000`.
Override with `VITE_API_BASE_URL`.

### Admin App

```bash
cd reactadmin
npm install
npm run dev
```

Admin API base URL is currently hardcoded to `http://localhost:8000`.

## Authentication Model

- Staff login: `POST /staff/login/` -> stores `staffToken` in `localStorage`
- Customer signup/login: `POST /customer/signup/`, `POST /customer/login/` -> stores `userToken`
- Protected operations use:

```text
Authorization: Token <token>
```

## API Endpoints (Current)

Base URL: `http://localhost:8000`

- Staff
  - `POST /staff/login/`
  - `GET|POST /staff/staff/`
  - `GET|PUT|DELETE /staff/staff/<id>/`
- Customer
  - `POST /customer/signup/`
  - `POST /customer/login/`
  - `POST /customer/me/`
  - `GET|POST /customer/customer/`
  - `GET|PUT|DELETE /customer/customer/<id>/`
- Category
  - `GET|POST /category/category/`
  - `GET|PUT|DELETE /category/category/<id>/`
  - `POST /category/upload-image/`
- Product
  - `GET|POST /product/product/`
  - `GET|PUT|DELETE /product/product/<id>/`
  - `POST /product/upload-image/`
- Subscription
  - `GET|POST /subscription/subscription/`
  - `GET|PATCH|PUT|DELETE /subscription/subscription/<id>/`

## Image Upload

Admin supports local uploads for product/category images through backend upload endpoints.

- Stored under:
  - `milkman/media/products/`
  - `milkman/media/categories/`
- Served in dev at `/media/<path>`.

## Implemented vs Pending

Implemented:

- Backend auth, CRUD endpoints, subscription flow, and catalog seeding
- User routes and 8-step subscription flow with `ProgressStepper`
- `ProductCard`, form components, and Framer Motion animation in `reactuser`
- Admin login, sidebar layout, and KPI dashboard

Pending or partial:

- Integrate `DataTable` into admin resource pages (`Staff`, `Customer`, `Category`, `Product`, `Subscription`)
- Move `reactadmin` API base URL to env variable
- Harden backend password handling for production (currently not fully production-grade)

## Common Commands

```bash
# backend
cd milkman
python manage.py runserver
python manage.py seed_catalog

# user app
cd reactuser
npm run dev
npm run build

# admin app
cd reactadmin
npm run dev
npm run build
```

## Notes for Production

- Replace development settings (`DEBUG`, permissive CORS, broad hosts).
- Serve static/media with proper infrastructure.
- Move secrets and API URLs to environment variables.

