# Component Integration Guide (Current)

Last updated: 2026-03-08

This guide reflects what is already integrated and what still needs integration.

## React Admin

### Already Integrated

- `Sidebar` and layout shell
- Dashboard route and KPI view
- Login + protected routing with `staffToken`

### Pending Integration

- `DataTable` exists at `reactadmin/src/components/DataTable.jsx` but is not yet the default table on:
  - `reactadmin/src/pages/Staff.jsx`
  - `reactadmin/src/pages/Customer.jsx`
  - `reactadmin/src/pages/Category.jsx`
  - `reactadmin/src/pages/Product.jsx`
  - `reactadmin/src/pages/Subscription.jsx`

### Suggested Integration Pattern for Admin Pages

```jsx
import DataTable from '../components/DataTable';

const columns = [
  { accessor: 'id', Header: 'ID', sortable: true },
  { accessor: 'name', Header: 'Name', sortable: true },
  { accessor: 'email', Header: 'Email', sortable: true },
];

<DataTable
  columns={columns}
  data={rows}
  isLoading={isLoading}
  onEdit={handleEdit}
  onDelete={handleDelete}
  emptyMessage="No records found"
/>
```

## React User

### Already Integrated

- `ProductCard` in products and dashboard
- Form components in auth and subscription pages
- `ProgressStepper` in all subscription steps
- Framer Motion in dashboard and selected subscription pages

### Subscription Stepper Mapping

- Step 1: Select category
- Step 2: Select product
- Step 3: Select quantity
- Step 4: Select duration
- Step 5: Select delivery slot
- Step 6: Address
- Step 7: Confirm
- Step 8: Success

## API Integration Notes

### Admin API

- File: `reactadmin/src/services/api.js`
- Base URL is currently hardcoded to `http://localhost:8000`
- Uses `staffToken`

### User API

- File: `reactuser/src/services/api.js`
- Base URL supports env override (`VITE_API_BASE_URL`)
- Uses `userToken`

## Recommended Next Integration Tasks

1. Replace all admin resource page tables with `DataTable`.
2. Standardize admin API base URL to environment variable.
3. Add missing sort/filter actions where page-specific behavior is needed.
4. Keep animation usage focused on user experience pages; avoid unnecessary admin motion.
