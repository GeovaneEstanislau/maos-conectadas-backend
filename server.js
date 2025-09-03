import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let db;

async function initDB() {
  db = await open({
    filename: "./db.sqlite",
    driver: sqlite3.Database
  });

  // Cria tabela se não existir
  await db.exec(`
    CREATE TABLE IF NOT EXISTS quizzes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pergunta TEXT,
      opcoes TEXT,
      resposta INTEGER
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS respostas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      alunoId INTEGER,
      quizId INTEGER,
      resposta INTEGER,
      correto BOOLEAN
    );
  `);
}

// Rota: pegar quiz por ID
app.get("/api/quizzes/:id", async (req, res) => {
  const quiz = await db.get("SELECT * FROM quizzes WHERE id = ?", [req.params.id]);
  if (!quiz) return res.status(404).json({ error: "Quiz não encontrado" });

  quiz.opcoes = JSON.parse(quiz.opcoes); // transforma de texto para array
  res.json(quiz);
});

// Rota: responder quiz
app.post("/api/quizzes/responder", async (req, res) => {
  const { quizId, resposta, alunoId } = req.body;
  const quiz = await db.get("SELECT * FROM quizzes WHERE id = ?", [quizId]);

  if (!quiz) return res.status(404).json({ error: "Quiz não encontrado" });

  const correto = Number(resposta) === Number(quiz.resposta);

  await db.run(
    "INSERT INTO respostas (alunoId, quizId, resposta, correto) VALUES (?, ?, ?, ?)",
    [alunoId, quizId, resposta, correto ? 1 : 0]
  );

  res.json({ correto });
});

// Inicia servidor
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
});
