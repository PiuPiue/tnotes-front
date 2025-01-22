const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const multer = require('multer');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// 图片上传配置
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// 创建上传目录
const fs = require('fs');
const dir = './uploads';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

// 笔记内容存储
const notes = new Map();

// 图片上传路由
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  res.json({
    url: `http://localhost:3000/uploads/${req.file.filename}`
  });
});

// 静态文件服务
app.use('/uploads', express.static('uploads'));

// Socket.IO连接处理
io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.on('join-note', (noteId) => {
    socket.join(noteId);
    if (notes.has(noteId)) {
      socket.emit('note-update', notes.get(noteId));
    }
  });

  socket.on('update-note', ({noteId, content}) => {
    notes.set(noteId, content);
    socket.to(noteId).emit('note-update', content);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
