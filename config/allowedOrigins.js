const allowedOrigins = [
  "http://127.0.0.1:5500",
  "http://localhost:2500",
  process.env.FRONTEND_URL
]

module.exports = allowedOrigins;