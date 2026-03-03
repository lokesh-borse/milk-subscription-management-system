# Milkman - Full Stack Dairy Subscription Platform

Milkman is a 3-part project:

- Django REST backend (`milkman/`)
- React user app (`reactuser/`)
- React admin app (`reactadmin/`)

It supports category/product management, customer signup/login, subscription flow, dashboard summaries, and local image upload for products and categories from admin.

## Tech Stack

- Backend: Django, Django REST Framework, SQLite, `corsheaders`
- Frontend: React (Vite), React Router, Axios
- Admin/User UI: Separate Vite apps

## Project Structure

```text
daytwo/
  milkman/       # Django API + SQLite DB + media files
  reactuser/     # Customer-facing app
  reactadmin/    # Staff admin app
```

## Prerequisites

- Python 3.12+ (recommended)
- Node.js 18+ and npm

## 1) Backend Setup (Django)

From `daytwo/`:

```bash
cd milkman
```

Create and activate virtual environment (if needed), then install dependencies:

```bash
pip install django djangorestframework django-cors-headers
```

Run migrations:

```bash
python manage.py migrate
```

Optional: seed realistic categories/products/images:

```bash
python manage.py seed_catalog
```

Start backend:

```bash
python manage.py runserver
```

Backend URL: `http://localhost:8000`

## 2) User App Setup

From `daytwo/`:

```bash
cd reactuser
npm install
npm run dev
```

User app runs on Vite dev server (typically `http://localhost:5174` or similar).

Notes:
- User app backend base URL defaults to `http://<current-host>:8000`
- You can override with `VITE_API_BASE_URL`

## 3) Admin App Setup

From `daytwo/`:

```bash
cd reactadmin
npm install
npm run dev
```

Admin app runs on Vite dev server (typically `http://localhost:5173`).

Notes:
- Admin API base URL is currently hardcoded to `http://localhost:8000`
- Staff token is stored as `staffToken` in localStorage after login

## Authentication Model

- `POST /staff/login/` returns staff token (for admin actions)
- `POST /customer/signup/` and `POST /customer/login/` return customer token (for user app)
- Protected write operations require token via:

```text
Authorization: Token <token>
```

## Core API Routes

Base: `http://localhost:8000`

- Staff
  - `POST /staff/login/`
  - `GET|POST /staff/staff/`
  - `PUT|DELETE /staff/staff/<id>/`

- Customers
  - `POST /customer/signup/`
  - `POST /customer/login/`
  - `GET|POST /customer/customer/`
  - `PUT|DELETE /customer/customer/<id>/`

- Categories
  - `GET|POST /category/category/`
  - `PUT|DELETE /category/category/<id>/`
  - `POST /category/upload-image/`  (multipart file upload: field `image`)

- Products
  - `GET|POST /product/product/`
  - `GET|PUT|DELETE /product/product/<id>/`
  - `POST /product/upload-image/`  (multipart file upload: field `image`)

- Subscriptions
  - `GET|POST /subscription/subscription/`
  - `PATCH|PUT|DELETE /subscription/subscription/<id>/`

## Local Image Upload (Admin)

You can upload local files directly in Admin:

- Products page:
  - Add form: choose file -> auto upload -> URL auto-filled
  - Edit row: choose file -> auto upload -> URL auto-filled

- Categories page:
  - Add form: choose file -> auto upload -> URL auto-filled
  - Edit row: choose file -> auto upload -> URL auto-filled

Backend stores uploaded files under:

```text
milkman/media/products/
milkman/media/categories/
```

And serves them in development through:

```text
/media/<path>
```

## Currency + Billing Behavior

- UI currency is INR (`₹`)
- Dashboard subscription total uses:

```text
daily product price * quantity * 30 * duration(months)
```

## Common Commands

Backend:

```bash
cd milkman
python manage.py runserver
python manage.py migrate
python manage.py seed_catalog
```

User frontend:

```bash
cd reactuser
npm run dev
npm run build
```

Admin frontend:

```bash
cd reactadmin
npm run dev
npm run build
```

## Troubleshooting

- Images not loading:
  - Ensure backend is running (`:8000`)
  - Hard refresh browser (`Ctrl+F5`)
  - Verify image URL in admin table
  - Check `media/` file exists for uploaded images

- 401/403 in admin writes:
  - Staff token missing/expired; login again in admin

- CORS/API issues:
  - Backend must be running before frontend
  - Confirm frontend points to `http://localhost:8000`

## Production Notes

- `DEBUG=True` and `ALLOWED_HOSTS=['*']` are dev settings; harden before deployment
- Serve static/media via proper web server/CDN in production
- Move secrets and DB config to environment variables

