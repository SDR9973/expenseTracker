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

async function parentExists(email) {
  const query = "SELECT 1 FROM tbl_107_parents WHERE email = ?";
  const [results] = await dbPool.query(query, [email]);
  return results.length > 0;
}

async function createParent(req, res) {
  const { email, name, password, child1_id, child2_id, bank, bank_account } = req.body;

  if (await parentExists(email)) {
    res.status(400).send({ error: "Parent already registered." });
    return;
  }

  const insertQuery = `
    INSERT INTO tbl_107_parents (email, name, password, child1_id, child2_id, bank, bank_account)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  try {
    const [insertResult] = await dbPool.query(insertQuery, [email, name, password, child1_id, child2_id, bank, bank_account]);
    console.log("New parent registered:", insertResult);
    res.status(201).send({ message: "Parent registration successful." });
  } catch (error) {
    console.error("Error registering parent:", error);
    res.status(500).send({ error: "Failed to register parent." });
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

async function updateParent(req, res) {
  const parentId = req.params.id;
  const { email, name, password, child1_id, child2_id, bank, bank_account } = req.body;

  try {
    const query = `
      UPDATE tbl_107_parents
      SET email = ?, name = ?, password = ?, child1_id = ?, child2_id = ?, bank = ?, bank_account = ?
      WHERE parent_id = ?
    `;
    const [result] = await dbPool.query(query, [email, name, password, child1_id, child2_id, bank, bank_account, parentId]);

    if (result.affectedRows === 0) {
      res.status(404).send({ error: "Parent not found." });
      return;
    }

    res.status(200).send({ message: "Parent updated successfully." });
  } catch (error) {
    console.error("Error updating parent:", error);
    res.status(500).send({ error: "Failed to update parent." });
  }
}

async function deleteParent(req, res) {
  const parentId = req.params.id;

  try {
    const query = "DELETE FROM tbl_107_parents WHERE parent_id = ?";
    const [result] = await dbPool.query(query, [parentId]);

    if (result.affectedRows === 0) {
      res.status(404).send({ error: "Parent not found." });
      return;
    }

    res.status(200).send({ message: "Parent deleted successfully." });
  } catch (error) {
    console.error("Error deleting parent:", error);
    res.status(500).send({ error: "Failed to delete parent." });
  }
}

module.exports = {
  createParent,
  loginParent,
  getParentById,
  updateParent,
  deleteParent
};
