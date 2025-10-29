# Electronics-Astra Backend

A full-featured REST API backend for managing coding problems, testcases, and admin authentication. Built with Node.js, Express, PostgreSQL, and MongoDB.


## 🎯 Overview

Electronics-Astra Backend is a RESTful API service designed for managing coding problem platforms. It provides secure admin authentication with 2FA, problem management with image uploads, and comprehensive testcase handling for problem evaluation.

**Current Status**: Development/Beta - Not production-ready 

---

## ✨ Features

### Authentication & Authorization
- ✅ Admin signup with email-based OTP verification (2FA)
- ✅ JWT-based authentication
- ✅ Secure password hashing (bcrypt)
- ✅ Protected admin routes
- ✅ Profile management (view, edit, delete)

### Problem Management
- ✅ CRUD operations for coding problems
- ✅ Multi-image upload support
- ✅ Rich problem metadata (title, difficulty, tags, description, constraints)
- ✅ Public and admin-only endpoints
- ✅ Cascade deletion (problems → testcases → files)

### Testcase Management
- ✅ Create visible and hidden testcases
- ✅ Link testcases to specific problems
- ✅ Public vs. admin-only testcase visibility
- ✅ Individual testcase CRUD operations
- ✅ Automatic cleanup on problem deletion

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Runtime** | Node.js (v18+) |
| **Framework** | Express.js |
| **Databases** | PostgreSQL (admin data), MongoDB (problem data) |
| **ORMs** | Sequelize (PostgreSQL), Mongoose (MongoDB) |
| **Authentication** | JWT, bcryptjs |
| **File Upload** | Multer |
| **Email** | Nodemailer |
| **Dev Tools** | nodemon, dotenv |

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
commit the changes

### Required Software

1. **Node.js** (v18.0.0 or higher)
   ```bash
   node --version  # Should output v18.x.x or higher
   ```
   [Download Node.js](https://nodejs.org/)

2. **PostgreSQL** (v12 or higher)
   ```bash
   psql --version  # Should output PostgreSQL 12.x or higher
   ```
   [Download PostgreSQL](https://www.postgresql.org/download/)

3. **MongoDB** (v5.0 or higher)
   ```bash
   mongod --version  # Should output v5.x.x or higher
   ```
   [Download MongoDB Community Server](https://www.mongodb.com/try/download/community)

4. **Git**
   ```bash
   git --version
   ```

### Account Setup

- **Gmail Account**: Required for sending OTP emails (you'll need an [App Password](https://support.google.com/accounts/answer/185833))
- **MongoDB Atlas** (Optional): For cloud MongoDB hosting

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/mohith1976/electronics-astra.git

# Navigate to backend directory
cd electronics-astra/backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages:
- `express`, `cors`, `dotenv` - Server essentials
- `sequelize`, `pg`, `pg-hstore` - PostgreSQL ORM
- `mongoose` - MongoDB ODM
- `jsonwebtoken`, `bcryptjs` - Authentication
- `nodemailer` - Email OTP delivery
- `multer`, `uuid` - File uploads
- `nodemon` - Development auto-reload

### Step 3: Database Setup

#### PostgreSQL Setup

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE electronics_astra;

# Exit psql
\q
```

#### MongoDB Setup (Local)

```bash
# Start MongoDB service (Windows)
net start MongoDB

# Start MongoDB service (macOS/Linux)
sudo systemctl start mongod

# Verify MongoDB is running
mongosh
# Should connect successfully
```

#### MongoDB Setup (Atlas - Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Add database user with password
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get connection string (looks like: `mongodb+srv://username:password@cluster0.mongodb.net/electronics-astra`)

---

## ⚙️ Configuration

### Step 1: Create Environment File

Create a `.env` file in the `backend/` directory:

```bash
# In backend/ directory
touch .env  # macOS/Linux
# OR
type nul > .env  # Windows
```

### Step 2: Configure Environment Variables

Add the following to your `.env` file:

```env
# PostgreSQL Configuration
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=electronics_astra
PG_USER=postgres
PG_PASSWORD=your_postgres_password

# MongoDB Configuration (choose one)
# Local MongoDB
MONGO_URI=mongodb://localhost:27017/electronics-astra
# OR Atlas MongoDB
# MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/electronics-astra?retryWrites=true&w=majority

# Server Configuration
PORT=5000
JWT_SECRET=your_very_long_random_secret_key_here_min_32_characters

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your_16_character_app_password
```

### Step 3: Generate Secure JWT Secret

```bash
# Generate a secure random string (Node.js)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as your `JWT_SECRET`.

### Step 4: Get Gmail App Password

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Select "Mail" and "Other (Custom name)"
5. Generate password (16 characters, no spaces)
6. Use this as `EMAIL_PASS` in `.env`


## MongoDB and Images

- Add `MONGO_URI` to your `.env`. Example:
  - Local: `mongodb://localhost:27017/electronics-astra`
  - Atlas: `mongodb+srv://<user>:<password>@cluster0.mongodb.net/electronics-astra?retryWrites=true&w=majority`
- Problems API stores images as URLs in the `images` array on the Problem document.
- For local testing we save uploaded images to `/uploads` and serve them statically at `http://localhost:5000/uploads/<filename>`.
- For production, replace the upload handling with S3 or other object storage and save public URLs.



## Install dependencies
⚠️ **Security Warning**: Never commit `.env` to version control. It's already in `.gitignore`.

---

## 🏃 Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

You should see:
```
Server running on port 5000
PostgreSQL connected
MongoDB connected successfully
```

### Production Mode

```bash
npm start
```

### Verify Server is Running

Open browser and navigate to:
```
http://localhost:5000
```

You should see the Express welcome message or 404 (depending on root route configuration).

### Troubleshooting

**PostgreSQL connection fails**
```bash
# Check PostgreSQL is running
# Windows
net start postgresql-x64-14

# macOS/Linux
sudo systemctl status postgresql
```

**MongoDB connection fails**
```bash
# Check MongoDB is running
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl status mongod

# Check connection string
mongosh "your_MONGO_URI_here"
```

**Port 5000 already in use**
- Change `PORT=5000` to another port in `.env` (e.g., `PORT=5001`)

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000
```

### Authentication Flow

#### 1. Request OTP for Signup
```http
POST /api/otp/request
Content-Type: application/json

{
  "email": "admin@example.com"
}
```

**Response (200)**:
```json
{
  "message": "OTP sent successfully"
}
```

#### 2. Verify OTP and Complete Signup
```http
POST /api/admin/signup/verify
Content-Type: application/json

{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "SecurePassword123!",
  "otp": "123456"
}
```

**Response (201)**:
```json
{
  "message": "Admin registered successfully",
  "admin": {
    "id": "uuid-here",
    "name": "Admin Name",
    "email": "admin@example.com"
  }
}
```

#### 3. Login
```http
POST /api/admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200)**:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "uuid-here",
    "name": "Admin Name",
    "email": "admin@example.com"
  }
}
```

### Problem Management

#### 4. Create Problem (Admin Only)
```http
POST /api/problems
Authorization: Bearer <your_jwt_token>
Content-Type: multipart/form-data

title: "Two Sum"
difficulty: "Easy"
tags: ["Array", "Hash Table"]
description: "Given an array of integers..."
constraints: "1 <= nums.length <= 10^4"
images: [File1, File2]
```

**Response (201)**:
```json
{
  "problem": {
    "_id": "problem_id_here",
    "title": "Two Sum",
    "difficulty": "Easy",
    "tags": ["Array", "Hash Table"],
    "description": "Given an array of integers...",
    "constraints": "1 <= nums.length <= 10^4",
    "images": ["/uploads/image1.jpg", "/uploads/image2.jpg"],
    "createdBy": "admin_id",
    "createdAt": "2025-10-20T10:30:00.000Z"
  }
}
```

#### 5. Get All Problems (Public)
```http
GET /api/problems
```

#### 6. Get Single Problem (Public)
```http
GET /api/problems/:id
```

#### 7. Update Problem (Admin Only)
```http
PUT /api/problems/:id
Authorization: Bearer <your_jwt_token>
Content-Type: multipart/form-data

title: "Updated Title"
difficulty: "Medium"
```

#### 8. Delete Problem (Admin Only)
```http
DELETE /api/problems/:id
Authorization: Bearer <your_jwt_token>
```

**Response (200)**:
```json
{
  "message": "Problem and all related data deleted successfully",
  "deletedTestcases": 5,
  "deletedFiles": {
    "success": 3,
    "failed": 0
  }
}
```

### Testcase Management

#### 9. Add Testcases to Problem (Admin Only)
```http
POST /api/problems/:id/testcases
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "visible": [
    {
      "input": "[2,7,11,15]\n9",
      "output": "[0,1]"
    }
  ],
  "hidden": [
    {
      "input": "[3,2,4]\n6",
      "output": "[1,2]"
    }
  ]
}
```

**Response (201)**:
```json
{
  "message": "Testcases added successfully",
  "visible": [...],
  "hidden": [...]
}
```

#### 10. Get All Testcases (Admin Only)
```http
GET /api/problems/:id/testcases
Authorization: Bearer <your_jwt_token>
```

#### 11. Get Public Testcases (No Auth Required)
```http
GET /api/problems/:id/testcases/public
```

#### 12. Update Single Testcase (Admin Only)
```http
PUT /api/problems/:id/testcases/:testcase_id
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "input": "updated input",
  "output": "updated output"
}
```

#### 13. Delete Single Testcase (Admin Only)
```http
DELETE /api/problems/:id/testcases/:testcase_id
Authorization: Bearer <your_jwt_token>
```

---

## 🧪 Testing Guide

### Manual Testing with Postman

#### Setup Postman Environment

1. Create new environment in Postman
2. Add variables:
   - `base_url`: `http://localhost:5000`
   - `admin_token`: (will be set after login)

#### Test Sequence

**Test 1: Complete Authentication Flow**

1. Request OTP
   - Method: POST
   - URL: `{{base_url}}/api/otp/request`
   - Body: `{"email": "test@example.com"}`
   - ✅ Expect: 200, "OTP sent successfully"
   - Check your email for OTP

2. Complete Signup
   - Method: POST
   - URL: `{{base_url}}/api/admin/signup/verify`
   - Body: Include name, email, password, and OTP from email
   - ✅ Expect: 201, admin object returned

3. Login
   - Method: POST
   - URL: `{{base_url}}/api/admin/login`
   - Body: `{"email": "test@example.com", "password": "your_password"}`
   - ✅ Expect: 200, JWT token returned
   - **Save the token** to `admin_token` environment variable

**Test 2: Problem Lifecycle**

4. Create Problem
   - Method: POST
   - URL: `{{base_url}}/api/problems`
   - Headers: `Authorization: Bearer {{admin_token}}`
   - Body: form-data with title, difficulty, description
   - ✅ Expect: 201, problem object with `_id`
   - **Save problem `_id`** for next tests

5. Get All Problems
   - Method: GET
   - URL: `{{base_url}}/api/problems`
   - ✅ Expect: 200, array containing your problem

6. Get Single Problem
   - Method: GET
   - URL: `{{base_url}}/api/problems/{{problem_id}}`
   - ✅ Expect: 200, problem details

**Test 3: Testcase Management**

7. Add Testcases
   - Method: POST
   - URL: `{{base_url}}/api/problems/{{problem_id}}/testcases`
   - Headers: `Authorization: Bearer {{admin_token}}`
   - Body: JSON with visible and hidden arrays
   - ✅ Expect: 201, testcases created
   - **Save a testcase `_id`**

8. Get Public Testcases
   - Method: GET
   - URL: `{{base_url}}/api/problems/{{problem_id}}/testcases/public`
   - ✅ Expect: 200, only visible testcases returned

9. Get All Testcases (Admin)
   - Method: GET
   - URL: `{{base_url}}/api/problems/{{problem_id}}/testcases`
   - Headers: `Authorization: Bearer {{admin_token}}`
   - ✅ Expect: 200, both visible and hidden testcases

**Test 4: Cleanup & Cascade Deletion**

10. Delete Problem
    - Method: DELETE
    - URL: `{{base_url}}/api/problems/{{problem_id}}`
    - Headers: `Authorization: Bearer {{admin_token}}`
    - ✅ Expect: 200, deletedTestcases count > 0

11. Verify Cleanup
    - Try to GET the problem again
    - ✅ Expect: 404, problem not found

### Expected Error Responses

| Scenario | Status | Response |
|----------|--------|----------|
| Invalid OTP | 400 | `{"error": "Invalid OTP"}` |
| Expired OTP | 400 | `{"error": "OTP expired"}` |
| Missing JWT | 401 | `{"error": "Unauthorized"}` |
| Invalid JWT | 403 | `{"error": "Invalid token"}` |
| Problem not found | 404 | `{"error": "Problem not found"}` |
| Duplicate email | 409 | `{"error": "Email already exists"}` |

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js              # Sequelize/PostgreSQL configuration
│   │   └── mongo.js           # Mongoose/MongoDB connection
│   │
│   ├── controllers/
│   │   ├── adminController.js # Admin auth logic
│   │   ├── otpController.js   # OTP generation/verification
│   │   └── problemController.js # Problem & testcase CRUD
│   │
│   ├── middlewares/
│   │   ├── auth.js            # JWT verification middleware
│   │   └── upload.js          # Multer file upload config
│   │
│   ├── models/
│   │   ├── User.js            # Sequelize User model (PostgreSQL)
│   │   ├── Problem.js         # Mongoose Problem model
│   │   └── Testcase.js        # Mongoose Testcase model
│   │
│   ├── routes/
│   │   ├── admin.js           # /api/admin/* routes
│   │   ├── otp.js             # /api/otp/* routes
│   │   └── problems.js        # /api/problems/* routes
│   │
│   ├── services/
│   │   ├── otpService.js      # OTP email sending logic
│   │   └── pendingSignupService.js # Temporary signup data store
│   │
│   └── server.js              # Express app entry point
│
├── uploads/                   # Local file storage (dev only)
├── .env                       # Environment variables (DO NOT COMMIT)
├── .env.example               # Example environment file
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

## ⚠️ Known Limitations

**🔴 CRITICAL - Not Production Ready**

This project is currently in **development/beta** stage. Do NOT deploy to production without addressing:

### Security Issues

1. **In-Memory OTP Storage**
   - OTPs are stored in application memory
   - Lost on server restart
   - Not suitable for distributed systems
   - **Fix**: Use Redis or database with TTL

2. **File Deletion Vulnerability**
   - Current implementation allows deletion of any file server has access to
   - No path traversal protection
   - **Fix**: Restrict deletions to `uploads/` directory only

3. **No Rate Limiting**
   - APIs can be abused (OTP spam, brute force)
   - **Fix**: Implement express-rate-limit

4. **Local File Storage**
   - Files stored on server filesystem
   - Not scalable for multiple servers
   - **Fix**: Use S3, Cloudinary, or similar cloud storage

### Missing Features

- Input validation (no express-validator or Joi)
- API request logging
- Automated tests (unit, integration)
- Database migrations system
- API versioning
- CORS configuration for production
- Error monitoring (Sentry, etc.)
- Health check endpoints

### Recommendations Before Production

1. Implement Redis for OTP storage
2. Add comprehensive input validation
3. Switch to cloud file storage (S3/GCS)
4. Add request rate limiting
5. Implement proper logging (Winston, Morgan)
6. Add integration tests
7. Set up CI/CD pipeline
8. Configure production CORS policies
9. Add API documentation (Swagger/OpenAPI)
10. Implement database backup strategy

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---


## 👤 Author

**Mohith**
- GitHub: [@mohith1976](https://github.com/mohith1976)

---
**Happy Coding! 🚀**
