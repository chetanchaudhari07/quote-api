# 📜 Quote API

A simple **RESTful API** built with **Node.js** and **Express.js** that returns a random inspirational quote.  
Includes **IP-based rate limiting** (5 requests per minute per IP) to prevent abuse, along with request logging and security headers.

---

## 🚀 Features
- **GET /api/quote** → Returns a random inspirational quote in JSON format.
- **Rate limiting** → Each IP can make up to **5 requests per minute**.
- **HTTP 429 handling** → Returns proper error with `Retry-After` header when the limit is exceeded.
- **Request logging** → Logs client IP, URL, status code, and response time using `morgan`.
- **Security** → Uses `helmet` for secure HTTP headers and `cors` for cross-origin support.
- **Health check** → `GET /health` returns service status.

---

## 📦 Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/chetanchaudhari07/quote-api
cd quote-api
npm install

Create a .env file in the project root:
PORT=4000
TRUST_PROXY=true


▶️Running the Server use : npm run dev

📌API Endpoints
http://localhost:4000/api/quote


🛠Tech Stack

Node.js

Express.js

Helmet

CORS

Morgan

Dotenv
