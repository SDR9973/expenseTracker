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

async function addTransaction(req, res) {
  const { child_id, amount, date, time, category_id } = req.body;

  const insertQuery = `
    INSERT INTO tbl_107_transactions (child_id, amount, date, time, category_id)
    VALUES (?, ?, ?, ?, ?)
  `;
  try {
    const [insertResult] = await dbPool.query(insertQuery, [child_id, amount, date, time, category_id]);
    console.log("New transaction recorded:", insertResult);
    res.status(201).send({ message: "Transaction added successfully." });
  } catch (error) {
    console.error("Error adding transaction:", error);
    res.status(500).send({ error: "Failed to add transaction." });
  }
}

async function fetchAllTransactions(req, res) {
  const query = "SELECT * FROM tbl_107_transactions";

  try {
    const [rows] = await dbPool.query(query);
    res.status(200).send(rows);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).send({ error: "Failed to fetch transactions." });
  }
}

async function fetchTransactionById(req, res) {
  const transactionId = req.params.id;
  const query = "SELECT * FROM tbl_107_transactions WHERE transaction_id = ?";

  try {
    const [rows] = await dbPool.query(query, [transactionId]);

    if (rows.length === 0) {
      res.status(404).send({ error: "Transaction not found." });
      return;
    }

    res.status(200).send(rows[0]);
  } catch (error) {
    console.error("Error fetching transaction:", error);
    res.status(500).send({ error: "Failed to fetch transaction." });
  }
}

module.exports = {
  addTransaction,
  fetchAllTransactions,
  fetchTransactionById,
};
