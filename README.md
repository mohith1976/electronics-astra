# MERN Backend

This is the backend for the MERN stack project `electronics-astra`.




# Electronics-Astra — Backend (Node/Express)

This repository contains the backend services for the Electronics-Astra project.
It currently exposes:

- Admin authentication (Postgres + Sequelize)
   - Signup with 2FA (OTP via email)
   - Verify OTP to complete signup
   - Login (JWT)
   - Profile: view / edit / delete / logout
- Problems management (MongoDB + Mongoose)
   - Create problems (admin only) with title, difficulty, tags, description, images, constraints
   - Read list of problems and single problem
   - Update and delete problems (admin only)

This README documents how to install, configure and test the project locally.

## What we used

- Node.js (v16+ recommended)
- Express
- PostgreSQL (Sequelize) — stores admin users
- MongoDB (Mongoose) — stores problems and future problem-related data
- JWT for authentication
- Nodemailer for OTP emails
- Multer for local image uploads (development)


## Project Structure
```

backend/
├─ src/
│  ├─ config/
│  │  ├─ db.js            # Sequelize/Postgres config
│  │  └─ mongo.js         # Mongoose/MongoDB connection
│  ├─ controllers/
│  │  ├─ adminController.js
│  │  ├─ otpController.js
│  │  └─ problemController.js
│  ├─ middlewares/
│  │  ├─ auth.js
│  │  └─ upload.js        # multer
│  ├─ models/
│  │  ├─ User.js          # Sequelize model (Postgres)
│  │  └─ Problem.js       # Mongoose model (MongoDB)
│  ├─ routes/
│  │  ├─ admin.js
│  │  ├─ otp.js
│  │  └─ problems.js
│  └─ services/
│     ├─ otpService.js
│     └─ pendingSignupService.js
├─ uploads/                # local uploaded images (dev)
├─ package.json
└─ .env
```

## Environment variables

Create `.env` in `backend/` with the following keys (example values shown):

```
# Postgres (Sequelize)
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=electronics-astra
PG_USER=postgres
PG_PASSWORD=your_postgres_password

# MongoDB (Mongoose)
MONGO_URI=mongodb://localhost:27017/electronics-astra

# Server
PORT=5000
JWT_SECRET=very_long_random_secret

# Email (Gmail example - use app password)
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

Keep this file out of source control. Do not commit secrets.


## MongoDB and Images

- Add `MONGO_URI` to your `.env`. Example:
  - Local: `mongodb://localhost:27017/electronics-astra`
  - Atlas: `mongodb+srv://<user>:<password>@cluster0.mongodb.net/electronics-astra?retryWrites=true&w=majority`
- Problems API stores images as URLs in the `images` array on the Problem document.
- For local testing we save uploaded images to `/uploads` and serve them statically at `http://localhost:5000/uploads/<filename>`.
- For production, replace the upload handling with S3 or other object storage and save public URLs.



## Install dependencies

From `backend/`:

```bash
npm install
```

This installs:

- express, dotenv, cors
- sequelize, pg, pg-hstore
- mongoose, mongodb
- jsonwebtoken, bcryptjs
- nodemailer
- multer (file uploads)
- uuid
- nodemon (dev)

## Run (development)

Start the server (reloads on change with nodemon):

```bash
npm run dev
```

Server will attempt to connect to both Postgres (Sequelize) and MongoDB (Mongoose) when `MONGO_URI` is set and Postgres config is valid.

## APIs (quick reference)

Base URL: `http://localhost:5000`

Authentication / OTP
- POST /api/otp/request — body: `{ "email": "admin@example.com" }` (sends OTP email)
- POST /api/otp/verify — body: `{ "email": "admin@example.com", "otp": "123456" }` (verify OTP for signup)

Admin (auth)
- POST /api/admin/signup — body: `{ name, email, password }` (step1: sends OTP)
- POST /api/admin/signup/verify — body: `{ email, otp }` (step2: create user)
- POST /api/admin/login — body: `{ email, password }` (returns JWT)
NAME
----
Electronics-Astra — Backend (Node/Express)

WHAT THIS IS
----------------
This repository contains the backend API for Electronics-Astra: an Express server that manages admin users (Postgres/Sequelize), and problem content and testcases (MongoDB/Mongoose). It supports JWT authentication, email OTP signup, local image uploads for problems, and per-problem testcases (visible/hidden) used for evaluation.

HOW TO INSTALL & SETUP IN VS CODE / ANY EDITOR
------------------------------------------------
Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL (running and accessible)
- MongoDB (local or Atlas)
- Git

Quick steps (VS Code)
1. Open VS Code and open this project folder (`backend/` inside the repo) or open the repo root.
2. Open an integrated terminal (View → Terminal).
3. Copy `.env.example` to `.env` or create `.env` at the project root and fill values (see section below).
4. Install dependencies:

```powershell
cd backend
npm install
```

5. Start the dev server (auto-restarts on file change):

```powershell
npm run dev
```

6. Use Postman or similar to exercise the API endpoints. Set `Authorization: Bearer <token>` where required.

ENV file (.env) - variables you must set
- PG_HOST, PG_PORT, PG_DATABASE, PG_USER, PG_PASSWORD
- MONGO_URI (mongodb://localhost:27017/electronics-astra or Atlas URI)
- PORT (optional; default 5000)
- JWT_SECRET (generate a secure random string)
- EMAIL_USER and EMAIL_PASS (to send OTPs; use an app password for Gmail)

NECESSARY PACKAGES (from package.json)
-------------------------------------
All dependencies are listed in `package.json`. Collective install command (already executed above):

```powershell
npm install
```

Key packages used:
- express — web framework
- dotenv — environment variables
- cors — CORS support
- sequelize, pg, pg-hstore — Postgres ORM
- mongoose, mongodb — MongoDB ODM/driver
- jsonwebtoken — JWT auth
- bcryptjs — password hashing
- nodemailer — send OTP emails
- multer — file uploads (local)
- uuid — generate unique problem/admin ids
- nodemon — dev auto-reload (devDependency)

CLONE + SETUP (step-by-step)
--------------------------------
1. Clone the repo:

```powershell
git clone <repo-url>
cd electronics-astra/backend
```

2. Create `.env` with the variables listed earlier.
3. Install dependencies: `npm install`.
4. Start DBs (Postgres and Mongo) or ensure your cloud DBs are reachable.
5. Run the server: `npm run dev`.

WHAT WE'VE DEVELOPED SO FAR — FEATURES & HOW THEY WORK
-------------------------------------------------------
Core areas implemented

1) Admin authentication (Postgres + Sequelize)
- Signup with 2FA (OTP sent over email using Nodemailer).
  - Flow: POST /api/otp/request → send email OTP. Verify with POST /api/otp/verify. Signup completes after OTP verification.
- Login: POST /api/admin/login → returns JWT on success.
- Profile endpoints: GET/PUT/DELETE /api/admin/profile (protected by JWT)

2) Problems management (MongoDB + Mongoose)
- Create problems (admin only) — supports multipart/form-data image uploads (stored in `/uploads`) and fields: title, difficulty, tags, description, constraints.
- Read problems: GET /api/problems and GET /api/problems/:id (public).
- Update problem (admin) — supports adding images on update.
- Delete problem (admin) — deletes the Problem document, also:
  - deletes all Testcase documents referencing that problem
  - attempts to delete all locally stored image files referenced in `problem.images` (returns counts of deleted/failed files)

3) Testcases (MongoDB)
- Testcase model: linked to a problem by `problem_id`. Fields: input, output, visible(boolean), createdBy.
- Add testcases (admin): POST /api/problems/:id/testcases with JSON containing arrays `visible` and `hidden`.
- Get all testcases (admin): GET /api/problems/:id/testcases
- Get public (visible) testcases: GET /api/problems/:id/testcases/public
- Get single: GET /api/problems/:id/testcases/:tcid
- Update single: PUT /api/problems/:id/testcases/:tcid
- Delete single: DELETE /api/problems/:id/testcases/:tcid

Data safety & validations implemented
- Testcase endpoints verify the referenced Problem exists before operating to prevent orphan testcases.
- Deleting a Problem deletes related testcases and attempts to delete referenced local files.
- Upload middleware accepts multiple file field names and stores files in `/uploads` with unique names.

Image management helpers
- When updating a problem, uploaded images are appended to `problem.images`. If an admin wants to remove a particular image, there's an endpoint:
  - DELETE /api/problems/:id/images — body: { "image": "/uploads/filename.jpg" } which removes the reference and unlinks the file.

Developer notes and recommendations
- OTP storage is in-memory for the demo — for production use persistent storage (Redis or DB) with expiry.
- Local uploads are for development; move to S3/GCS in production and store public URLs.
- The server currently unlinks files by resolving paths relative to the project root. For safety, I recommend enforcing a check that only allows deletion inside `uploads/`.
- Consider adding express-validator or Joi to validate request bodies more strictly.

How to test quickly (Postman smoke test)
1. Start server: `npm run dev`.
2. Request OTP / signup flow to create admin, or create admin directly in Postgres then login to get JWT.
3. Create a problem (multipart/form-data) with at least one image. Note the returned `problem_id`.
4. POST testcases to that problem. Note returned testcase `_id`.
5. Update a testcase (PUT) and verify changes.
6. Delete the problem (DELETE /api/problems/:id) and verify:
   - Response includes deletedTestcases and deletedFiles counts.
   - GET /api/problems/:id returns 404.
   - Attempt to open the uploaded image URLs in browser — they should be gone if deletedFiles indicates success.

Where to go from here (next improvements)
- Persist OTPs in Redis and enforce expiry/attempt limits.
- Harden file deletion to only allow deletions inside `uploads/`.
- Add request validation (express-validator) and better error messages.
- Add automated integration tests that run the create -> add testcases -> delete problem sequence and assert cleanup.
- Move file storage to a cloud bucket and return public URLs in `problem.images`.

Contact / Maintainers
- Repo owner: mohith1976

---

If you want, I will:
- implement the stricter "only delete inside uploads/" safety check now, and
- add an automated smoke test script that runs the full lifecycle (create -> add testcases -> delete) and prints the results. Which would you like me to do next?

