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
  const { child_id, transfer_amount, description } = req.body;
  const date = new Date().toISOString().split('T')[0]; 
  const time = new Date().toTimeString().split(' ')[0]; 

  const insertQuery = `
    INSERT INTO tbl_107_transactions (child_id, transfer_amount, date, time, description)
    VALUES (?, ?, ?, ?, ?)
  `;
  try {
    const [insertResult] = await dbPool.query(insertQuery, [child_id, transfer_amount, date, time, description]);
    res.status(201).send({ message: "Transaction added successfully.", transactionId: insertResult.insertId });
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
async function fetchTransactionsByChildIdAndMonth(req, res) {
  const childId = req.params.childId;
  const month = req.params.month; 

  const query = `
    SELECT * FROM tbl_107_transactions 
    WHERE child_id = ? AND MONTH(date) = ?
  `;

  try {
    const [rows] = await dbPool.query(query, [childId, month]);
    if (rows.length === 0) {
      res.status(404).send({ error: "No transactions found for this child in the specified month." });
      return;
    }

    res.status(200).send(rows);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).send({ error: "Failed to fetch transactions." });
  }
}



module.exports = {
  addTransaction,
  fetchAllTransactions,
  fetchTransactionById,
  fetchTransactionsByChildIdAndMonth,
};
