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

  try {
    const query = `
      INSERT INTO tbl_107_transactions (child_id, amount, date, time, category_id)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await dbPool.query(query, [child_id, amount, date, time, category_id]);
    res.status(201).send({ message: "Transaction created successfully.", transaction_id: result.insertId });
  } catch (error) {
    console.error("Error adding transaction:", error);
    res.status(500).send({ error: "Failed to add transaction." });
  }
}

async function fetchAllTransactions(req, res) {
  try {
    const query = "SELECT * FROM tbl_107_transactions";
    const [rows] = await dbPool.query(query);
    res.status(200).send(rows);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).send({ error: "Failed to fetch transactions." });
  }
}

async function fetchTransactionById(req, res) {
  const transactionId = req.params.id;

  try {
    const query = "SELECT * FROM tbl_107_transactions WHERE transaction_id = ?";
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

async function updateTransaction(req, res) {
  const transactionId = req.params.id;
  const { child_id, amount, date, time, category_id } = req.body;

  try {
    const query = `
      UPDATE tbl_107_transactions
      SET child_id = ?, amount = ?, date = ?, time = ?, category_id = ?
      WHERE transaction_id = ?
    `;
    const [result] = await dbPool.query(query, [child_id, amount, date, time, category_id, transactionId]);

    if (result.affectedRows === 0) {
      res.status(404).send({ error: "Transaction not found." });
      return;
    }

    res.status(200).send({ message: "Transaction updated successfully." });
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).send({ error: "Failed to update transaction." });
  }
}

async function deleteTransaction(req, res) {
  const transactionId = req.params.id;

  try {
    const query = "DELETE FROM tbl_107_transactions WHERE transaction_id = ?";
    const [result] = await dbPool.query(query, [transactionId]);

    if (result.affectedRows === 0) {
      res.status(404).send({ error: "Transaction not found." });
      return;
    }

    res.status(200).send({ message: "Transaction deleted successfully." });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).send({ error: "Failed to delete transaction." });
  }
}

module.exports = {
  addTransaction,
  fetchAllTransactions,
  fetchTransactionById,
  updateTransaction,
  deleteTransaction,
};
