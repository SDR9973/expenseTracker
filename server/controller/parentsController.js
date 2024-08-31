const mysql = require("mysql2/promise");
require("dotenv").config();

const dbPool = mysql.createPool({
  host: process.env.DATABASE_HOSTNAME,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function loginParent(req, res) {
  const { email, password } = req.body;
  try {
    const query = "SELECT * FROM tbl_107_parents WHERE email = ?";
    const [rows] = await dbPool.query(query, [email]);

    if (rows.length === 0) {
      return res.status(404).send({ error: "Parent not found." });
    }

    const parent = rows[0];
    if (parent.password !== password) {
      return res.status(401).send({ error: "Invalid password." });
    }

    res.status(200).send({ message: "Login successful.", parent });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send({ error: "Failed to login parent." });
  }
}

async function getParentById(req, res) {
  const parentId = req.params.id;
  const query = "SELECT * FROM tbl_107_parents WHERE parent_id = ?";

  try {
    const [rows] = await dbPool.query(query, [parentId]);

    if (rows.length === 0) {
      res.status(404).send({ error: "Parent not found." });
      return;
    }

    res.status(200).send(rows[0]);
  } catch (error) {
    console.error("Error fetching parent:", error);
    res.status(500).send({ error: "Failed to fetch parent." });
  }
}

module.exports = {
  loginParent,
  getParentById,
};
