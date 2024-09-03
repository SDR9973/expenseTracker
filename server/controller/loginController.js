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

async function login(req, res) {
  const { email, password, account_type } = req.body;
  let query = "";
  let _error = "";

  try {
    if(account_type === "child") {
      query = "SELECT * FROM tbl_107_children WHERE email = ?";
      _error = "Child not found.";
    } else if (account_type === "parent") {
      query = "SELECT * FROM tbl_107_parents WHERE email = ?";
      _error = "Parent not found.";
    } else {
      return res.status(400).send({ error: "Invalid account type." });
    }

    const [rows] = await dbPool.query(query, [email]);

    if (rows.length === 0) {
      return res.status(404).send({ error: _error });
    }

    const login = rows[0];

    if (login.password !== password) {
      return res.status(401).send({ error: "Invalid password." });
    }

    res.status(200).send({ message: "Login successful.", login });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send({ error: "Failed to login." });
  }
}

module.exports = {
  login,
};
