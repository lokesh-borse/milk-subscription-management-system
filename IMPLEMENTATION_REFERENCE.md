# Implementation Reference (Current State)

Last updated: 2026-03-08

## Backend (`milkman/`)

### Installed Apps

- `staff`
- `customer`
- `category`
- `product`
- `subscription`

### URL Mounts

From `milkman/milkman/urls.py`:

- `/staff/`
- `/customer/`
- `/category/`
- `/product/`
- `/subscription/`
- `/media/` served in debug mode

### Auth Model

- Staff token login via `POST /staff/login/`
- Customer login/signup via:
  - `POST /customer/login/`
  - `POST /customer/signup/`
- Customer self endpoint:
  - `POST /customer/me/`
- Token format used by clients:

```text
Authorization: Token <token>
```

### API Endpoint Reference

- Staff
  - `GET|POST /staff/staff/`
  - `GET|PUT|DELETE /staff/staff/<id>/`
  - `POST /staff/login/`
- Customer
  - `GET|POST /customer/customer/`
  - `GET|PUT|DELETE /customer/customer/<id>/`
  - `POST /customer/signup/`
  - `POST /customer/login/`
  - `POST /customer/me/`
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

### Management Commands

- `python manage.py seed_catalog`

## React Admin (`reactadmin/`)

### Routing

From `reactadmin/src/App.jsx`:

- `/login`
- `/`
- `/staff`
- `/customer`
- `/category`
- `/product`
- `/subscription`

All non-login routes are protected by `PrivateRoute` using `staffToken`.

### API Client

From `reactadmin/src/services/api.js`:

- Base URL: `http://localhost:8000` (hardcoded)
- Adds `Authorization: Token <staffToken>` when token exists
- On 401/403: clears local storage and redirects to `#/login`

### UI Integration Status

Integrated:

- Sidebar + layout shell
- Dashboard page and KPI cards

Created but not integrated broadly:

- `DataTable` component exists in `reactadmin/src/components/DataTable.jsx`
- Resource pages still primarily use standard table layouts

## React User (`reactuser/`)

### Routing

From `reactuser/src/App.jsx`:

Public:

- `/`
- `/categories`
- `/products`
- `/product/:id`
- `/login`
- `/signup`

Protected:

- `/dashboard`
- `/subscribe/category`
- `/subscribe/product`
- `/subscribe/quantity`
- `/subscribe/duration`
- `/subscribe/slot`
- `/subscribe/address`
- `/subscribe/confirm`
- `/subscribe/success`
- `/subscription-details/:id`

### API Client

From `reactuser/src/services/api.js`:

- Base URL: `VITE_API_BASE_URL` or `http(s)://<current-host>:8000`
- Adds `Authorization: Token <userToken>` when available
- On 401: clears auth data and redirects to `#/login`

### UI Integration Status

Integrated:

- `ProductCard` in products and dashboard pages
- Form components (`FormInput`, `FormSelect`, `FormTextarea`)
- `ProgressStepper` across all subscription steps
- Framer Motion animations in key pages/components

## Build and Run

Both React apps:

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run preview`

Backend:

- `python manage.py runserver`
- `python manage.py migrate`
- `python manage.py seed_catalog`

## Known Gaps

- Admin `DataTable` still needs full-page integration on resource pages.
- Admin API base URL should be moved to environment variable.
- Backend auth/password handling should be hardened before production.
