import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(express.json());

// Inicialização do banco
let db;
const initDb = async () => {
  db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT
    );
  `);
};
await initDb();

// Rota básica
app.get("/", (req, res) => {
  res.send("🚀 API Mãos Conectadas funcionando!");
});

// Rota de teste do HuggingFace
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  try {
    const response = await fetch("https://api-inference.huggingface.co/models/gpt2", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: message })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Erro HuggingFace:", error);
    res.status(500).json({ error: "Erro ao conectar com HuggingFace" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
