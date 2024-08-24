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

async function addWallet(req, res) {
  const { child_id, parent_id, amount } = req.body;

  const insertQuery = `
    INSERT INTO tbl_107_wallets (child_id, parent_id, amount)
    VALUES (?, ?, ?)
  `;
  try {
    const [result] = await dbPool.query(insertQuery, [child_id, parent_id, amount]);
    res.status(201).send({ message: "Wallet added successfully.", walletId: result.insertId });
  } catch (error) {
    console.error("Error adding wallet:", error);
    res.status(500).send({ error: "Failed to add wallet." });
  }
}

async function fetchAllWallets(req, res) {
  const query = "SELECT * FROM tbl_107_wallets";

  try {
    const [rows] = await dbPool.query(query);
    res.status(200).send(rows);
  } catch (error) {
    console.error("Error fetching wallets:", error);
    res.status(500).send({ error: "Failed to fetch wallets." });
  }
}

async function fetchWalletById(req, res) {
  const walletId = req.params.id;
  const query = "SELECT * FROM tbl_107_wallets WHERE wallet_id = ?";

  try {
    const [rows] = await dbPool.query(query, [walletId]);

    if (rows.length === 0) {
      res.status(404).send({ error: "Wallet not found." });
      return;
    }

    res.status(200).send(rows[0]);
  } catch (error) {
    console.error("Error fetching wallet:", error);
    res.status(500).send({ error: "Failed to fetch wallet." });
  }
}

async function updateWallet(req, res) {
  const walletId = req.params.id;
  const { child_id, parent_id, amount } = req.body;

  const updateQuery = `
    UPDATE tbl_107_wallets
    SET child_id = ?, parent_id = ?, amount = ?
    WHERE wallet_id = ?
  `;
  try {
    const [result] = await dbPool.query(updateQuery, [child_id, parent_id, amount, walletId]);

    if (result.affectedRows === 0) {
      res.status(404).send({ error: "Wallet not found." });
      return;
    }

    res.status(200).send({ message: "Wallet updated successfully." });
  } catch (error) {
    console.error("Error updating wallet:", error);
    res.status(500).send({ error: "Failed to update wallet." });
  }
}

async function deleteWallet(req, res) {
  const walletId = req.params.id;

  const deleteQuery = "DELETE FROM tbl_107_wallets WHERE wallet_id = ?";
  try {
    const [result] = await dbPool.query(deleteQuery, [walletId]);

    if (result.affectedRows === 0) {
      res.status(404).send({ error: "Wallet not found." });
      return;
    }

    res.status(200).send({ message: "Wallet deleted successfully." });
  } catch (error) {
    console.error("Error deleting wallet:", error);
    res.status(500).send({ error: "Failed to delete wallet." });
  }
}

module.exports = {
  addWallet,
  fetchAllWallets,
  fetchWalletById,
  updateWallet,
  deleteWallet,
};
