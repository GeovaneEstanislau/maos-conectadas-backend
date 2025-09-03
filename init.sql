-- Tabela de matérias
CREATE TABLE IF NOT EXISTS materias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL
);

-- Tabela de quizzes
CREATE TABLE IF NOT EXISTS quizzes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  materia_id INTEGER,
  pergunta TEXT,
  opcoes TEXT, -- JSON com as opções
  resposta_correta INTEGER,
  FOREIGN KEY(materia_id) REFERENCES materias(id)
);

-- Tabela de respostas dos alunos
CREATE TABLE IF NOT EXISTS respostas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  aluno_id INTEGER,
  quiz_id INTEGER,
  resposta INTEGER,
  correto INTEGER,
  data DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Inserindo algumas matérias
INSERT INTO materias (nome) VALUES ('Lógica de Programação');
INSERT INTO materias (nome) VALUES ('Redes de Computadores');
INSERT INTO materias (nome) VALUES ('Banco de Dados');

-- Inserindo quizzes
INSERT INTO quizzes (materia_id, pergunta, opcoes, resposta_correta)
VALUES (1, 'Qual é a estrutura básica de um algoritmo?', '["Entrada", "Processamento", "Saída", "Todas as anteriores"]', 3);

INSERT INTO quizzes (materia_id, pergunta, opcoes, resposta_correta)
VALUES (2, 'Qual protocolo é usado para comunicação na web?', '["FTP", "HTTP", "SMTP", "DNS"]', 1);

INSERT INTO quizzes (materia_id, pergunta, opcoes, resposta_correta)
VALUES (3, 'Qual comando SQL é usado para buscar dados?', '["SELECT", "INSERT", "DELETE", "UPDATE"]', 0);
