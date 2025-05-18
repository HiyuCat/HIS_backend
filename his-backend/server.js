// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const patientRoutes = require("./patient");

const app = express();
app.use(cors({
    origin: 'http://localhost:3000' // หรือ port ที่ frontend รัน
}));
app.use(express.json());

app.use("/api", patientRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));