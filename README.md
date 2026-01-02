# 🚀 Express REST API Starter Kit (NoSQL)

A robust, production-ready, and fully-featured REST API starter kit built with **Express.js**, **TypeScript**, and **MongoDB (Mongoose)**. This project follows best practices for architecture, security, and scalability.

## ✨ Key Featuress

*   **🏗 Architecture:** Clean **Controller-Service-Model** layered architecture.
*   **🔒 Security:** **Helmet** for headers (CSP optimized), **CORS**, and **Rate Limiting**.
*   **🔑 Authentication:** Secure **JWT** (Access & Refresh Tokens) with **Passport** strategies.
*   **💽 Database:** **MongoDB** using **Mongoose** ORM with pagination and JSON plugins.
*   **✅ Validation:** Strictly typed request validation using **Zod**.
*   **📝 Documentation:** Auto-generated API Docs using **Swagger UI**.
*   **☁️ Serverless Ready:** Optimized for deployment on **Vercel** with cached DB connections.
*   **🐳 Docker Ready:** Complete manual Docker setup with persistent volumes and networking.
*   **🧪 Automated Testing:** Custom Python scripts suite for end-to-end API testing.
*   **🪵 Logging:** Integrated **Winston** and **Morgan** logger.

---

## 🛠 Prerequisites

Before you begin, ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v22 or higher)
*   [npm](https://www.npmjs.com/)
*   [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (or a local MongoDB instance)
*   [Python 3.x](https://www.python.org/) (for running API tests)
*   [Docker](https://www.docker.com/) (Optional, for containerized deployment)

---

## 🚀 Getting Started (Local Development)

**Recommendation:** It is highly recommended to run the project locally first to ensure your environment variables and database connection are correct.

### 1. Clone the Repository
```bash
git clone https://github.com/mnabielap/starter-kit-restapi-express-nosql.git
cd starter-kit-restapi-express-nosql
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory. You can copy the structure from below:

```env
# .env

# Environment (development, production, or test)
NODE_ENV=development
PORT=3000

# MongoDB Connection String (Atlas or Local)
# For Atlas, ensure IP Access List allows your IP or 0.0.0.0/0
MONGODB_URL=mongodb+srv://<user>:<password>@cluster0.example.mongodb.net/my-db?retryWrites=true&w=majority

# JWT Secrets
JWT_SECRET=your_super_secret_key_here
JWT_ACCESS_EXPIRATION_MINUTES=30
JWT_REFRESH_EXPIRATION_DAYS=30
JWT_RESET_PASSWORD_EXPIRATION_MINUTES=10
JWT_VERIFY_EMAIL_EXPIRATION_MINUTES=10

# SMTP Configuration (Required for app startup validation)
# You can use dummy values if you don't need email features locally
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password
EMAIL_FROM=no-reply@yourapp.com
```

### 4. Run the Development Server
This runs the server using `nodemon` and `ts-node` with hot-reloading.
```bash
npm run dev
```
The server will start at `http://localhost:3000`.

---

## ☁️ Deployment on Vercel

This project is optimized for Vercel Serverless Functions. It uses a **Cached Connection** pattern in `src/index.ts` to prevent database connection exhaustion.

### 1. Prepare MongoDB Atlas
Since Vercel uses dynamic IP addresses, you **cannot** whitelist specific IPs.
1.  Go to **MongoDB Atlas Dashboard** > **Network Access**.
2.  Add IP Address: `0.0.0.0/0` (Allow Access from Anywhere).
3.  Ensure your Database User has the correct Read/Write permissions.

### 2. Push to GitHub
Make sure your project is pushed to a GitHub repository.
```bash
git add .
git commit -m "Ready for deploy"
git push origin main
```

### 3. Deploy in Vercel Dashboard
1.  **Import Project:** Select your GitHub repository in Vercel.
2.  **Framework Preset:** Select **Other**.
3.  **Output Directory:** Override and set to **`.`** (Dot) or leave empty (Default). **DO NOT set to `dist`**.
4.  **Environment Variables:** You MUST add all variables from your `.env` file into Vercel settings.
    *   `VERCEL` = `true`
    *   `NODE_ENV` = `production`
    *   `MONGODB_URL` = `mongodb+srv://...`
    *   `JWT_SECRET` = `...`
    *   `SMTP_HOST`, `SMTP_PORT`, etc. (Required!)
5.  **Click Deploy.**

### 4. Verify
Once deployed, check your API documentation at:
`https://your-project-name.vercel.app/v1/docs`

---

## 🐳 Deployment with Docker

If you prefer a containerized environment with persistent data, follow these steps. We use a custom bridge network to communicate between the App and the DB.

### 1. Create Docker Environment File
Create a file named `.env.docker`.
> **Important:** The `MONGODB_URL` must point to the container name (`restapi_express_nosql_db_container`), not localhost.

```env
# .env.docker

NODE_ENV=production
PORT=5005

# Connect to the MongoDB Container Name
MONGODB_URL=mongodb://restapi_express_nosql_db_container:27017/express_nosql_db

JWT_SECRET=docker_production_secret
JWT_ACCESS_EXPIRATION_MINUTES=30
JWT_REFRESH_EXPIRATION_DAYS=30
JWT_RESET_PASSWORD_EXPIRATION_MINUTES=10
JWT_VERIFY_EMAIL_EXPIRATION_MINUTES=10

# SMTP (Use real credentials for production)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USERNAME=user
SMTP_PASSWORD=password
EMAIL_FROM=docker@yourapp.com
```

### 2. Setup Network & Volumes
Run these commands once to set up the infrastructure.
```bash
# Create a custom network for communication
docker network create restapi_express_nosql_network

# Create volume for Database persistence
docker volume create restapi_express_nosql_db_volume

# Create volume for Media/Uploads persistence
docker volume create restapi_express_nosql_media_volume
```

### 3. Run MongoDB Container
Start the database container attached to the network and volume.
```bash
docker run -d \
  --network restapi_express_nosql_network \
  --name restapi_express_nosql_db_container \
  -v restapi_express_nosql_db_volume:/data/db \
  mongo:latest
```

### 4. Build & Run Application Container
Build the image and run it on port `5005`.

```bash
# Build the image
docker build -t restapi-express_nosql-app .

# Run the container
docker run -d -p 5005:5005 \
  --env-file .env.docker \
  --network restapi_express_nosql_network \
  -v restapi_express_nosql_media_volume:/app/uploads \
  --name restapi-express_nosql-container \
  restapi-express_nosql-app
```
The API is now accessible at `http://localhost:5005`.

---

## 🎮 Docker Container Management

Here are the essential commands to manage your running containers.

### View Logs
Check real-time logs from the application.
```bash
docker logs -f restapi-express_nosql-container
```

### Stop Container
Stops the application without deleting data.
```bash
docker stop restapi-express_nosql-container
```

### Restart Container
Start the container again after stopping.
```bash
docker start restapi-express_nosql-container
```

### Remove Container
Deletes the container instance (Volume data remains safe).
```bash
docker stop restapi-express_nosql-container
docker rm restapi-express_nosql-container
```

### Manage Volumes
```bash
# List all volumes
docker volume ls

# ⚠️ Remove volume (WARNING: PERMANENT DATA LOSS)
# Only run this if you want to wipe the database completely.
docker volume rm restapi_express_nosql_db_volume
docker volume rm restapi_express_nosql_media_volume
```

---

## 📖 API Documentation

The project includes an interactive Swagger UI.
*   **Local:** `http://localhost:3000/v1/docs`
*   **Vercel:** `https://your-app.vercel.app/v1/docs`
*   **Docker:** `http://localhost:5005/v1/docs`

---

## 🧪 Automated API Testing (Python)

Instead of manually using Postman, this project includes a suite of Python scripts in the `api_tests/` folder. These scripts handle **Token Management** automatically (saving/loading tokens from `secrets.json`).

### How to Run
Simply run the python file. No arguments needed.

**1. Authentication Flow (Group A)**
Start here to register, login, and generate tokens.
```bash
# Register a new user
python api_tests/A1.auth_register.py

# Login (Saves access_token to secrets.json)
python api_tests/A2.auth_login.py

# Refresh Token
python api_tests/A3.auth_refresh_tokens.py
```

**2. User Management Flow (Group B)**
Requires a valid token (Login first).
```bash
# Create a user (Admin only logic)
python api_tests/B1.user_create.py

# Get all users (Pagination)
python api_tests/B2.user_get_all.py

# Get single user details
python api_tests/B3.user_get_one.py
```

> **Note:** Every request generates a detailed log file (e.g., `A2.auth_login.json`) containing the full Request and Response data for debugging.

---

## 🏗 Project Structure

```text
src/
├── config/         # Environment variables and configuration
├── controllers/    # Request/Response logic (Connects Route to Service)
├── docs/           # Swagger definition files
├── middlewares/    # Express middlewares (Auth, Validate, RateLimit, Error)
├── models/         # Mongoose Schemas and Types
│   └── plugins/    # Mongoose plugins (toJSON, paginate)
├── routes/         # API Routes (v1)
├── services/       # Business Logic (Database interaction)
├── types/          # TypeScript type definitions
├── utils/          # Utility functions (ApiError, Pick, CatchAsync)
├── validations/    # Zod Schemas for request validation
├── app.ts          # Express App setup (Middlewares)
└── index.ts        # Entry point (DB Connection & Server Start)
```

## 📄 License

This project is licensed under the MIT License.