# my-api (Express + PostgreSQL + JWT)

Minimal Node.js API with Express, PostgreSQL, and JWT authentication.

## Structure

- `src/index.js` – App entry, mounts routes
- `src/config/db.js` – PostgreSQL Pool config
- `src/utils/jwt.js` – Sign/verify JWT helpers
- `src/middleware/auth.js` – `requireAuth` middleware
- `src/routes/auth.js` – `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
- `src/routes/zones.js` – CRUD for zones
- `src/routes/collecteurs.js` – CRUD for collecteurs
- `src/routes/batiments.js` – CRUD for batiments + image upload endpoints
- `sql/schema.sql` – Users table schema
- `.env.example` – Example environment config

## Prerequisites

- Node.js >= 18
- PostgreSQL >= 13 with `psql` available

## Setup

1) Copy env

```bash
cp .env.example .env
```

Option A: Use individual PG vars (`PGHOST`, `PGUSER`, ...)

Option B: Use a single `DATABASE_URL` like:

```
DATABASE_URL=postgres://user:password@localhost:5432/kcaf_db
```

2) Install deps

```bash
npm install
```

3) Create database and schema (adjust user/password if needed)

```bash
# Create DB (skip if already exists)
createdb kcaf_db || true

# Load schema
psql "$DATABASE_URL" -f sql/schema.sql || psql -h "$PGHOST" -U "$PGUSER" -d "$PGDATABASE" -f sql/schema.sql

# Create verification codes table for email verification

## Notes
- This service does not perform writes to the DB.
- No authentication is required by design.
- If you need auth or stricter CORS, you can add it.
- The API runs on port 4001 by default to avoid conflicts with the main API.
```bash
npm run db:migrate
```

### Endpoints

- Single upload (admin):

```
POST /batiments/:id/image
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
Field: image (file)
```

- Multiple upload (admin):

```
POST /batiments/:id/images
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
Field: images (multiple files)
```

### cURL examples

Single image:

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -F image=@/path/to/photo.jpg \
  http://localhost:4000/batiments/1/image
```

Multiple images:

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -F images=@/path/one.jpg \
  -F images=@/path/two.png \
  http://localhost:4000/batiments/1/images
```

### Response format

- `GET /batiments` and `GET /batiments/:id` include `images: [{ id, filename, path }]` where `path` is a public URL under `/uploads`.
