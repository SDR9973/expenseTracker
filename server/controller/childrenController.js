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

async function addChild(req, res) {
  const { name, parent_id } = req.body;

  const insertQuery = `
    INSERT INTO tbl_107_children (name, parent_id)
    VALUES (?, ?)
  `;
  try {
    const [insertResult] = await dbPool.query(insertQuery, [name, parent_id]);
    console.log("New child added:", insertResult);
    res.status(201).send({ message: "Child added successfully." });
  } catch (error) {
    console.error("Error adding child:", error);
    res.status(500).send({ error: "Failed to add child." });
  }
}

async function fetchAllChildren(req, res) {
  const query = "SELECT * FROM tbl_107_children";

  try {
    const [rows] = await dbPool.query(query);
    res.status(200).send(rows);
  } catch (error) {
    console.error("Error fetching children:", error);
    res.status(500).send({ error: "Failed to fetch children." });
  }
}

async function fetchChildById(req, res) {
  const childId = req.params.id;
  const query = "SELECT * FROM tbl_107_children WHERE child_id = ?";

  try {
    const [rows] = await dbPool.query(query, [childId]);

    if (rows.length === 0) {
      res.status(404).send({ error: "Child not found." });
      return;
    }

    res.status(200).send(rows[0]);
  } catch (error) {
    console.error("Error fetching child:", error);
    res.status(500).send({ error: "Failed to fetch child." });
  }
}

module.exports = {
  addChild,
  fetchAllChildren,
  fetchChildById,
};
