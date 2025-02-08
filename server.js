require("dotenv").config();
const express = require("express");
const { ethers } = require("ethers");

const app = express();
app.use(express.json());

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Health Check Route
app.get("/", (req, res) => {
    res.send("Alemmi MVP API is running.");
});

// Standardizing incoming transactions
app.post("/standardize-transaction", (req, res) => {
    const { tradeId, assetType, quantity, counterparty, settlementType } = req.body;

    // Convert trade into standardized format
    const standardizedTransaction = {
        trade_id: tradeId,
        asset_type: assetType.toUpperCase(),
        quantity: parseFloat(quantity),
        counterparty_id: counterparty,
        settlement_method: settlementType === "on-chain" ? "BLOCKCHAIN" : "SWIFT"
    };

    res.json({ status: "Success", standardizedTransaction });
});

// Transaction Execution Route
app.post("/transfer", async (req, res) => {
    try {
        const { recipient, amount } = req.body;
        const tx = await wallet.sendTransaction({
            to: recipient,
            value: ethers.parseEther(amount.toString())
        });
        await tx.wait();
        res.json({ success: true, txHash: tx.hash });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log("API running on port 3000"));
