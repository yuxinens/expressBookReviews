const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

const jwtSecret = process.env.JWT_SECRET || 'my_secret_key';

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

// Middleware untuk autentikasi
app.use("/customer/auth/*", function auth(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: "Token is required or invalid format" });
    }

    const token = authHeader.split(" ")[1]; // Ambil token setelah "Bearer"

    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            console.error("JWT verification error:", err);
            return res.status(403).json({ message: "Invalid token" });
        }

        req.user = decoded; // Simpan data user dari token
        next(); // Lanjutkan ke rute berikutnya
    });
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
