import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Conectar ao banco
let db;
(async () => {
  db = await open({
    filename: "./database.db",
    driver: sqlite3.Database,
  });
  console.log("✅ Banco conectado!");
})();

// Função auxiliar para chamar a API do Hugging Face
async function callHuggingFace(prompt) {
  try {
    const response = await fetch("https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    if (!response.ok) {
      throw new Error(`Erro na API HF: ${response.statusText}`);
    }

    const data = await response.json();
    return data[0]?.generated_text || "Não consegui gerar resposta.";
  } catch (err) {
    console.error("⚠️ Erro Hugging Face:", err.message);
    return "Desculpe, estou com problemas para responder agora. Tente novamente mais tarde.";
  }
}

// Rota de chat com IA
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Mensagem não fornecida" });
  }

  const reply = await callHuggingFace(message);
  res.json({ reply });
});

// Inicializar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
