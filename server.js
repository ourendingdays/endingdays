require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");

const app = express();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5,
});

app.get("/api/doomsdays", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, doomsday_date, display_year, detail
      FROM doomsdays
      ORDER BY doomsday_date ASC
    `);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load doomsdays" });
  }
});

app.listen(Number(process.env.PORT) || 3000, () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
});