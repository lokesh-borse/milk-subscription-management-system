# Changelog

All notable documentation and integration-stage updates are tracked here.

## [1.1.0] - 2026-03-08

### Changed

- Updated root project docs to reflect actual current implementation stage.
- Clarified that `reactadmin` dashboard and sidebar are integrated.
- Clarified that `reactadmin` `DataTable` component exists but is not yet integrated into resource pages.
- Documented that `reactuser` uses `ProductCard`, form components, and `ProgressStepper` in the active subscription flow.
- Documented current Framer Motion usage in `reactuser` and noted no active usage in `reactadmin`.
- Updated setup guidance to match current API base URL behavior:
  - `reactadmin`: hardcoded `http://localhost:8000`
  - `reactuser`: dynamic host-based URL with optional `VITE_API_BASE_URL`
- Synced endpoint references with current Django URL config.

### Notes

- This release is documentation alignment, not a backend/frontend feature release.

## [1.0.0] - 2026-03-03

### Added

- Initial professional UI redesign documentation set.
- Initial records for sidebar, dashboard, datatable, product card, form components, and progress stepper work.
