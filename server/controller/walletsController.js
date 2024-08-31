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

async function createWallet(req, res) {
  const { child_id, parent_id, allowance, bank, bank_account } = req.body;

  const insertQuery = `
    INSERT INTO tbl_107_wallets (child_id, parent_id, allowance, bank, bank_account)
    VALUES (?, ?, ?, ?, ?)
  `;
  try {
    const [insertResult] = await dbPool.query(insertQuery, [child_id, parent_id, allowance, bank, bank_account]);
    res.status(201).send({ message: "Wallet created successfully.", walletId: insertResult.insertId });
  } catch (error) {
    console.error("Error creating wallet:", error);
    res.status(500).send({ error: "Failed to create wallet." });
  }
}

async function getAllWallets(req, res) {
  const query = "SELECT * FROM tbl_107_wallets";

  try {
    const [rows] = await dbPool.query(query);
    res.status(200).send(rows);
  } catch (error) {
    console.error("Error fetching wallets:", error);
    res.status(500).send({ error: "Failed to fetch wallets." });
  }
}

async function getWalletById(req, res) {
  const walletId = req.params.id;
  const query = "SELECT * FROM tbl_107_wallets WHERE child_id = ?";

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
  const { parent_id, allowance, bank, bank_account } = req.body;

  const updateQuery = `
    UPDATE tbl_107_wallets
    SET parent_id = ?, allowance = ?, bank = ?, bank_account = ?
    WHERE child_id = ?
  `;
  try {
    const [updateResult] = await dbPool.query(updateQuery, [parent_id, allowance, bank, bank_account, walletId]);

    if (updateResult.affectedRows === 0) {
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

  const deleteQuery = "DELETE FROM tbl_107_wallets WHERE child_id = ?";

  try {
    const [deleteResult] = await dbPool.query(deleteQuery, [walletId]);

    if (deleteResult.affectedRows === 0) {
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
  createWallet,
  getAllWallets,
  getWalletById,
  updateWallet,
  deleteWallet,
};
