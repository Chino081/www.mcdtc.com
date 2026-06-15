const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

// ========== 配置 ==========
const PORT = process.env.PORT || 3090;
const MAX_ITEMS = 100;          // 最大留言条数
const MAX_NICKNAME_LEN = 20;
const MAX_MESSAGE_LEN = 200;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS || '*'; // 生产环境请设为具体域名

// ========== 初始化数据库 ==========
const dbPath = path.join(__dirname, 'guestbook.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nickname TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
    ip TEXT
  )
`);

// 限制最大条数的预编译语句
const deleteOldest = db.prepare(`
  DELETE FROM messages WHERE id IN (
    SELECT id FROM messages ORDER BY id DESC LIMIT -1 OFFSET ?
  )
`);

// ========== 预编译 SQL ==========
const stmts = {
  getAll: db.prepare('SELECT id, nickname, message, created_at FROM messages ORDER BY id DESC LIMIT ?'),
  insert: db.prepare('INSERT INTO messages (nickname, message, ip) VALUES (?, ?, ?)'),
  deleteById: db.prepare('DELETE FROM messages WHERE id = ?'),
  count: db.prepare('SELECT COUNT(*) AS cnt FROM messages'),
};

// ========== Express 应用 ==========
const app = express();

app.use(cors({ origin: ALLOWED_ORIGINS }));
app.use(express.json());

// 信任反向代理（获取真实 IP）
app.set('trust proxy', true);

// ---------- 获取留言列表 ----------
app.get('/api/messages', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 50, MAX_ITEMS);
  const rows = stmts.getAll.all(limit);
  res.json({ code: 0, data: rows });
});

// ---------- 发表留言 ----------
app.post('/api/messages', (req, res) => {
  let { nickname, message } = req.body || {};

  nickname = (nickname || '').trim();
  message = (message || '').trim();

  if (!nickname) return res.status(400).json({ code: 1, msg: '昵称不能为空' });
  if (!message)  return res.status(400).json({ code: 1, msg: '留言内容不能为空' });

  nickname = nickname.substring(0, MAX_NICKNAME_LEN);
  message  = message.substring(0, MAX_MESSAGE_LEN);

  // 获取客户端 IP
  const ip = req.ip || req.connection.remoteAddress || '';

  const info = stmts.insert.run(nickname, message, ip);

  // 超出上限时删除最旧的
  const { cnt } = stmts.count.get();
  if (cnt > MAX_ITEMS) {
    deleteOldest.run(MAX_ITEMS);
  }

  res.json({
    code: 0,
    data: { id: info.lastInsertRowid, nickname, message }
  });
});

// ---------- 删除留言 ----------
app.delete('/api/messages/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(400).json({ code: 1, msg: '无效的 ID' });

  stmts.deleteById.run(id);
  res.json({ code: 0 });
});

// ---------- 健康检查 ----------
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// ========== 启动服务 ==========
app.listen(PORT, () => {
  console.log(`留言板后端已启动 → http://localhost:${PORT}`);
});
