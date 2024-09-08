const { dbPool } = require("../dbConnect");

async function createWallet(req, res) {
  const { child_id, parent_id, allowance, bank, currency } = req.body;
  console.log(req.body)
  const insertQuery = `
    INSERT INTO tbl_107_wallets (child_id, parent_id, allowance, bank, currency)
    VALUES (?, ?, ?, ?, ?)
  `;
  try {
    const [insertResult] = await dbPool.query(insertQuery, [child_id, parent_id, allowance, bank, currency]);
    res.status(201).send({ message: "Wallet created successfully." });
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

async function getAllWalletsByParentId(req, res) {
  try {
    const parentId = req.params.id;
    const [wallets] = await dbPool.query("SELECT * FROM tbl_107_wallets WHERE parent_id = ?", [parentId]);

    if (!wallets.length) {
      return res.status(404).json({ message: "No wallets found" });
    }

    res.json(wallets);
  } catch (error) {
    console.error("Error fetching wallets:", error);
    res.status(500).json({ error: "Error fetching wallets" });
  }
}

async function getWalletByChildId(req, res) {
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
  const child_id = req.params.id;
  const { allowance } = req.body;

  const updateQuery = `
      UPDATE tbl_107_wallets
      SET allowance = ?
      WHERE child_id = ?
    `;
  try {
    const [updateResult] = await dbPool.query(updateQuery, [allowance, child_id]);

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
  console.log(walletId)
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
  getAllWalletsByParentId,
  getWalletByChildId,
  updateWallet,
  deleteWallet,
};
