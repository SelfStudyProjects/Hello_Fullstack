// 깃허브 액션 설정을 위한 백엔드 인덱스 파일

const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// health
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// simple message using db
app.get('/api/message', async (req, res) => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'db',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'rootpw',
      database: process.env.DB_NAME || 'appdb',
    });
    // 테이블이 없으면 자동으로 생성
    await conn.execute('CREATE TABLE IF NOT EXISTS messages (id INT AUTO_INCREMENT PRIMARY KEY, message TEXT)');
    const [rows] = await conn.execute('SELECT message FROM messages LIMIT 1');
    await conn.end();
    if (rows && rows.length) {
      return res.json({ message: rows[0].message });
    } else {
      return res.json({ message: 'Hello from Docker + MySQL!' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'DB error', detail: err.message });
  }
});

// simple POST to create message
app.post('/api/message', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'message required' });
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'db',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'rootpw',
      database: process.env.DB_NAME || 'appdb',
    });
    await conn.execute('CREATE TABLE IF NOT EXISTS messages (id INT AUTO_INCREMENT PRIMARY KEY, message TEXT)');
    await conn.execute('INSERT INTO messages (message) VALUES (?)', [message]);
    await conn.end();
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'DB error', detail: err.message });
  }
});

app.listen(port, () => console.log(`listening ${port}`));
