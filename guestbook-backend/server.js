const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// ========== 配置 ==========
const PORT = process.env.PORT || 3090;
const MAX_ITEMS = 100;
const MAX_NICKNAME_LEN = 20;
const MAX_MESSAGE_LEN = 200;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS || '*';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Chino';

// ========== 数据文件 ==========
const DB_FILE = path.join(__dirname, 'messages.json');

function loadMessages() {
  try {
    if (!fs.existsSync(DB_FILE)) return [];
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function saveMessages(msgs) {
  fs.writeFileSync(DB_FILE, JSON.stringify(msgs, null, 2), 'utf-8');
}

// 启动时加载数据到内存
let messages = loadMessages();
let nextId = messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1;

// ========== Express ==========
const app = express();

app.use(cors({ origin: ALLOWED_ORIGINS }));
app.use(express.json());
app.set('trust proxy', true);

// ---------- 获取留言列表 ----------
app.get('/api/messages', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 50, MAX_ITEMS);
  const data = messages.slice(-limit).reverse();
  res.json({ code: 0, data });
});

// ---------- 发表留言 ----------
app.post('/api/messages', (req, res) => {
  let { nickname, message } = req.body || {};

  nickname = (nickname || '').trim();
  message = (message || '').trim();

  if (!nickname) return res.status(400).json({ code: 1, msg: '昵称不能为空' });
  if (!message) return res.status(400).json({ code: 1, msg: '留言内容不能为空' });

  const entry = {
    id: nextId++,
    nickname: nickname.substring(0, MAX_NICKNAME_LEN),
    message: message.substring(0, MAX_MESSAGE_LEN),
    created_at: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')
  };

  messages.push(entry);

  // 超出上限裁剪
  if (messages.length > MAX_ITEMS) {
    messages = messages.slice(messages.length - MAX_ITEMS);
  }

  saveMessages(messages);
  res.json({ code: 0, data: entry });
});

// ---------- 删除留言（需要管理员密码） ----------
app.delete('/api/messages/:id', (req, res) => {
  const { password } = req.body || {};
  if (password !== ADMIN_PASSWORD) {
    return res.status(403).json({ code: 2, msg: '密码错误' });
  }

  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(400).json({ code: 1, msg: '无效的 ID' });

  const idx = messages.findIndex(m => m.id === id);
  if (idx !== -1) {
    messages.splice(idx, 1);
    saveMessages(messages);
  }
  res.json({ code: 0 });
});

// ---------- 健康检查 ----------
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// ========== 启动 ==========
app.listen(PORT, () => {
  console.log(`留言板后端已启动 → http://localhost:${PORT}`);
});
