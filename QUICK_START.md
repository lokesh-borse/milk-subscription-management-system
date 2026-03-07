# Quick Start

Last updated: 2026-03-08

## 1. Start Backend

```bash
cd milkman
python manage.py migrate
python manage.py seed_catalog
python manage.py runserver
```

Backend URL: `http://localhost:8000`

## 2. Start User App

```bash
cd reactuser
npm install
npm run dev
```

Notes:

- Uses `VITE_API_BASE_URL` when set.
- Otherwise defaults to `http(s)://<current-host>:8000`.

## 3. Start Admin App

```bash
cd reactadmin
npm install
npm run dev
```

Notes:

- API base URL is hardcoded to `http://localhost:8000` in `reactadmin/src/services/api.js`.

## 4. Smoke Test Checklist

Backend:

- `POST /staff/login/` returns token.
- `POST /customer/signup/` creates user and token.
- `GET /product/product/` returns catalog data.
- `GET /subscription/subscription/` works with auth token.

User app:

- Public pages load: `/`, `/categories`, `/products`.
- Login/signup works and redirects to `/dashboard`.
- 8-step subscription flow works:
  - `/subscribe/category`
  - `/subscribe/product`
  - `/subscribe/quantity`
  - `/subscribe/duration`
  - `/subscribe/slot`
  - `/subscribe/address`
  - `/subscribe/confirm`
  - `/subscribe/success`

Admin app:

- Login stores `staffToken`.
- Dashboard (`/`) shows KPI cards.
- Sidebar navigation works.
- Resource pages load (`/staff`, `/customer`, `/category`, `/product`, `/subscription`).

## Current Integration Notes

Integrated now:

- `reactuser`: `ProductCard`, form components, `ProgressStepper`, Framer Motion animations.
- `reactadmin`: `Sidebar`, `Dashboard`, auth-protected routing.



## Build Commands

```bash
# user
cd reactuser
npm run build

# admin
cd reactadmin
npm run build
```
