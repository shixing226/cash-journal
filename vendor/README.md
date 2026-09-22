# Pinned browser dependencies

These public upstream distributions are served from the same origin so startup does not depend on a third-party CDN connection.

- `supabase-2.116.0.js`: `@supabase/supabase-js@2.116.0/dist/umd/supabase.js` (MIT).
- `xlsx-0.18.5.js`: `xlsx@0.18.5/dist/xlsx.full.min.js` (Apache-2.0). This preserves the existing export dependency, now loaded only on export. Do not use this legacy version to parse untrusted spreadsheets.

No private data or credentials are stored in this directory. SheetJS is used for export only. Upstream license files are retained alongside each distribution.
