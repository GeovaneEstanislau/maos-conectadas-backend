import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const app = express();
app.use(express.json());

// Banco de dados
let db;
(async () => {
  db = await open({
    filename: "./db.sqlite",
    driver: sqlite3.Database,
  });
})();

// Rotas
app.get("/", (req, res) => {
  res.send("🚀 Backend Mãos Conectadas rodando!");
});

// Lista de matérias
app.get("/api/materias", async (req, res) => {
  const materias = await db.all("SELECT * FROM materias");
  res.json(materias);
});

// Pegar um quiz aleatório por matéria
app.get("/api/quizzes/:materiaId", async (req, res) => {
  const { materiaId } = req.params;
  const quiz = await db.get(
    "SELECT * FROM quizzes WHERE materia_id = ? ORDER BY RANDOM() LIMIT 1",
    [materiaId]
  );

  if (!quiz) return res.status(404).json({ error: "Nenhum quiz encontrado" });

  res.json({
    id: quiz.id,
    pergunta: quiz.pergunta,
    opcoes: JSON.parse(quiz.opcoes),
  });
});

// Responder um quiz
app.post("/api/quizzes/responder", async (req, res) => {
  const { quizId, resposta, alunoId } = req.body;

  const quiz = await db.get("SELECT * FROM quizzes WHERE id = ?", [quizId]);
  if (!quiz) return res.status(404).json({ error: "Quiz não encontrado" });

  const correto = quiz.resposta_correta === resposta ? 1 : 0;

  await db.run(
    "INSERT INTO respostas (aluno_id, quiz_id, resposta, correto) VALUES (?, ?, ?, ?)",
    [alunoId, quizId, resposta, correto]
  );

  res.json({ correto });
});

// Porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("✅ Servidor rodando na porta " + PORT);
});
