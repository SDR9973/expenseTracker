const morgan = require("morgan");
const express = require("express");
const cors = require("cors");
const parentsRouter = require("./routes/parents");
const walletsRouter = require("./routes/wallets");
const transactionsRouter = require("./routes/transactions");
const childrenRouter = require("./routes/children");
const loginRouter = require("./routes/login");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(morgan("combined"));
app.use(cors(
  {
    origin: [ 'http://localhost:5500', 'https://se.shenkar.ac.il/students/2023-2024/web1/']
  }
));
app.use(express.json());
app.use("/api/parents", parentsRouter);
app.use("/api/wallets", walletsRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/api/children", childrenRouter);
app.use("/api/login", loginRouter);
app.get("/", (req, res) => {
  res.status(200).send("Welcome to the Expense Tracker API!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
