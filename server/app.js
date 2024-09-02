const morgan = require("morgan");
const express = require("express");
const cors = require("cors");
const parentsRouter = require("./routes/parents");
const walletsRouter = require("./routes/wallets");
const transactionsRouter = require("./routes/transactions");
const childrenRouter = require("./routes/children");
require("dotenv").config();

const app = express();

//for logging requests in the console
app.use(morgan("dev"));

app.use(cors());
app.use(express.json());
app.use("/api/parents", parentsRouter);
app.use("/api/wallets", walletsRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/api/children", childrenRouter);

app.get("/", (req, res) => {
  res.status(200).send("Welcome to the Expense Tracker API!");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
