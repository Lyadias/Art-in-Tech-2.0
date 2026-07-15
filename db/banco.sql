-- ─── Art In Tech — Banco de Dados ───────────────────────────

CREATE DATABASE IF NOT EXISTS art_in_tech_db;
USE art_in_tech_db;

-- ─── USUÁRIOS ─────────────────────────────────────────────────

CREATE TABLE usuarios (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  nome      VARCHAR(100) NOT NULL,
  email     VARCHAR(150) NOT NULL UNIQUE,
  senha     VARCHAR(255) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── POSTS ───────────────────────────────────────────────────

CREATE TABLE posts (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id  INT,
  descricao   TEXT,
  imagem      VARCHAR(255),
  criado_em   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- ─── CURTIDAS ─────────────────────────────────────────────────

CREATE TABLE curtidas (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  post_id    INT,
  usuario_id INT,
  criado_em  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (post_id)    REFERENCES posts(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
