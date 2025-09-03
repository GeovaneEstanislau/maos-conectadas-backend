import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function seed() {
  const db = await open({
    filename: "./db.sqlite",
    driver: sqlite3.Database
  });

  await db.run(`
    INSERT INTO quizzes (pergunta, opcoes, resposta)
    VALUES (
      "Quanto é 2 + 2?",
      '["3","4","5","22"]',
      1
    )
  `);

  console.log("Quiz inicial adicionado ✅");
}

seed();
