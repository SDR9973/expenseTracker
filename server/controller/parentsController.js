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

async function getChildrenByParentId(req, res) {
  const parentId = req.params.id;
  const query = "SELECT * FROM tbl_107_children WHERE parent_id = ?";

  try {
    const [rows] = await dbPool.query(query, [parentId]);

    if (rows.length === 0) {
      res.status(404).send({ error: "No children found for this parent." });
      return;
    }

    res.status(200).send(rows);
  } catch (error) {
    console.error("Error fetching children:", error);
    res.status(500).send({ error: "Failed to fetch children." });
  }
}
async function fetchAllTransactionsForChildrenByMonth(req, res) {
  const parentId = req.params.id;
  const month = req.query.month; 

  if (!month) {
    return res.status(400).send({ error: "Month is required as a query parameter." });
  }

  const getChildrenQuery = `
    SELECT child_id FROM tbl_107_children 
    WHERE parent_id = ?
  `;

  try {
    const [children] = await dbPool.query(getChildrenQuery, [parentId]);
    if (children.length === 0) {
      return res.status(404).send({ error: "No children found for this parent." });
    }

    const childIds = children.map(child => child.child_id);

    const getTransactionsQuery = `
      SELECT * FROM tbl_107_transactions 
      WHERE child_id IN (?) AND MONTH(date) = ?
    `;

    const [transactions] = await dbPool.query(getTransactionsQuery, [childIds, month]);

    if (transactions.length === 0) {
      return res.status(404).send({ error: "No transactions found for the children in the specified month." });
    }

    res.status(200).send(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).send({ error: "Failed to fetch transactions." });
  }
}


module.exports = {
  loginParent,
  getParentById,
  getChildrenByParentId,
  fetchAllTransactionsForChildrenByMonth,
};
