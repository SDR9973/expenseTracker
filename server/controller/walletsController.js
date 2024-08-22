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
    const [insertResult] = await dbPool.query(insertQuery, [child_id, parent_id, amount]);
    console.log("New wallet created:", insertResult);
    res.status(201).send({ message: "Wallet created successfully." });
  } catch (error) {
    console.error("Error creating wallet:", error);
    res.status(500).send({ error: "Failed to create wallet." });
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

module.exports = {
  addWallet,
  fetchAllWallets,
  fetchWalletById,
};
