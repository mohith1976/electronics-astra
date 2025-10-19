# MERN Backend

This is the backend for the MERN stack project `electronics-astra`.


MongoDB and Images

- Add `MONGO_URI` to your `.env`. Example:
  - Local: `mongodb://localhost:27017/electronics-astra`
  - Atlas: `mongodb+srv://<user>:<password>@cluster0.mongodb.net/electronics-astra?retryWrites=true&w=majority`
- Problems API stores images as URLs in the `images` array on the Problem document.
- For local testing we save uploaded images to `/uploads` and serve them statically at `http://localhost:5000/uploads/<filename>`.
- For production, replace the upload handling with S3 or other object storage and save public URLs.



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
- GET /api/admin/profile — header: `Authorization: Bearer <token>`
- PUT /api/admin/profile — header: `Authorization: Bearer <token>`, body: `{ name?, email?, password? }`
- DELETE /api/admin/profile — header: `Authorization: Bearer <token>`
- POST /api/admin/logout — header: `Authorization: Bearer <token>`

Problems (MongoDB)
- POST /api/problems — create (admin only) — multipart/form-data: fields: `title`, `difficulty`, `tags` (JSON string or array), `description`, `constraints`, files: `images` (multiple). Header: `Authorization: Bearer <token>`
- GET /api/problems — list problems (public)
- GET /api/problems/:id — get problem by `problem_id` (public)
- PUT /api/problems/:id — update problem (admin only) — can send updated fields and additional `images`
- DELETE /api/problems/:id — delete problem (admin only)

Notes on images
- During development images are stored in `/uploads` and served at `http://localhost:5000/uploads/<filename>`.
- `Problem.images` stores URLs/paths to images. Frontend should use the URL as `src` in `<img>`.
- For production, replace multer/local storage with a cloud storage solution (S3, GCS, etc.) and store public URLs.

## Testing with Postman

1. Start server `npm run dev`.
2. Request OTP: POST `/api/otp/request` with `{ "email": "you@domain.com" }`.
3. Check email and get OTP.
4. Verify OTP: POST `/api/otp/verify` with `{ "email": "you@domain.com", "otp": "123456" }`.
5. Complete signup: POST `/api/admin/signup/verify` (if using the two-step signup implemented) and then login.
6. Use returned JWT in `Authorization: Bearer <token>` header to create problems and test protected endpoints.

Examples for creating problems (Postman)

Multipart/form-data example:

- URL: `POST http://localhost:5000/api/problems`
- Headers: `Authorization: Bearer <token>`
- Body (form-data):
   - title: "Two Sum"
   - difficulty: "easy"
   - tags: "[\"array\", \"hashmap\"]"  (JSON string)
   - description: "Given an array..."
   - constraints: "n <= 1e5"
   - images: (file) choose one or more files with key `images`

If you prefer to send image URLs instead of uploading files, submit JSON body:

```json
{
   "title": "Two Sum",
   "difficulty": "easy",
   "tags": ["array","hashmap"],
   "description": "...",
   "images": ["https://.../img1.png"]
}
```

