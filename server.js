const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ─── CONEXÃO COM BANCO ────────────────────────────────────────

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin", // senha 
  database: "art_in_tech_db"
});

db.connect(err => {
  if (err) {
    console.error("Erro ao conectar no banco:", err);
    return;
  }
  console.log("Banco de dados conectado ✅");
});

// ─── CADASTRO ─────────────────────────────────────────────────

app.post("/cadastro", (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.json({ erro: "Preencha todos os campos." });
  }

  db.query(
    "SELECT id FROM usuarios WHERE email = ?",
    [email],
    (err, rows) => {
      if (err) return res.status(500).json({ erro: "Erro no servidor." });
      if (rows.length > 0) return res.json({ erro: "E-mail já cadastrado." });

      db.query(
        "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
        [nome, email, senha],
        (err, result) => {
          if (err) return res.status(500).json({ erro: "Erro ao criar conta." });
          res.json({ mensagem: "Conta criada com sucesso!" });
        }
      );
    }
  );
});

// ─── LOGIN ────────────────────────────────────────────────────

app.post("/login", (req, res) => {
  const { email, senha } = req.body;

  db.query(
    "SELECT id, nome, email FROM usuarios WHERE email = ? AND senha = ?",
    [email, senha],
    (err, rows) => {
      if (err) return res.status(500).json({ erro: "Erro no servidor." });
      if (rows.length === 0) return res.json({ erro: "E-mail ou senha incorretos." });
      res.json(rows[0]);
    }
  );
});

// ─── LISTAR TODOS OS POSTS ────────────────────────────────────

app.get("/posts", (req, res) => {
  db.query(
    `SELECT posts.*, usuarios.nome
     FROM posts
     JOIN usuarios ON usuarios.id = posts.usuario_id
     ORDER BY posts.id DESC`,
    (err, rows) => {
      if (err) return res.status(500).json({ erro: "Erro ao buscar posts." });
      res.json(rows);
    }
  );
});

// ─── POSTS POR USUÁRIO (para o perfil) ───────────────────────

app.get("/posts/usuario/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    `SELECT posts.*, usuarios.nome
     FROM posts
     JOIN usuarios ON usuarios.id = posts.usuario_id
     WHERE posts.usuario_id = ?
     ORDER BY posts.id DESC`,
    [id],
    (err, rows) => {
      if (err) return res.status(500).json({ erro: "Erro ao buscar posts do usuário." });
      res.json(rows);
    }
  );
});

// ─── CRIAR POST ───────────────────────────────────────────────

app.post("/posts", (req, res) => {
  const { usuario_id, descricao, imagem } = req.body;

  if (!usuario_id || !descricao) {
    return res.json({ erro: "Dados incompletos." });
  }

  db.query(
    "INSERT INTO posts (usuario_id, descricao, imagem) VALUES (?, ?, ?)",
    [usuario_id, descricao, imagem || null],
    (err, result) => {
      if (err) return res.status(500).json({ erro: "Erro ao criar post." });
      res.json({ mensagem: "Post criado!", id: result.insertId });
    }
  );
});

// ─── CURTIR POST ──────────────────────────────────────────────

app.post("/curtir/:id", (req, res) => {
  const { id } = req.params;
  const { usuario_id } = req.body;

  db.query(
    "INSERT INTO curtidas (post_id, usuario_id) VALUES (?, ?)",
    [id, usuario_id],
    (err) => {
      if (err) return res.status(500).json({ erro: "Erro ao curtir." });
      res.json({ mensagem: "Post curtido ❤️" });
    }
  );
});

// ─── SERVIDOR ─────────────────────────────────────────────────

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});