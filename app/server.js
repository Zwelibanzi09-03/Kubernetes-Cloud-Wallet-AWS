const express = require("express");
const app = express();

app.use(express.json());

let wallet = {
  name: "Cloud Wallet",
  owner: "Ndandise Xalisa",
  balance: 5000,
};

app.get("/", (req, res) => {
  res.send("Kubernetes Cloud Wallet Running");
});

app.get("/wallet", (req, res) => {
  res.json(wallet);
});

app.post("/deposit/:amount", (req, res) => {
  const amount = parseInt(req.params.amount);
  wallet.balance += amount;

  res.json({
    message: `Deposited R${amount}`,
    wallet,
  });
});

app.post("/withdraw/:amount", (req, res) => {
  const amount = parseInt(req.params.amount);

  if (amount > wallet.balance) {
    return res.json({
      message: "Insufficient funds",
    });
  }

  wallet.balance -= amount;

  res.json({
    message: `Withdrawn R${amount}`,
    wallet,
  });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
