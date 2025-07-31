// backend/index.js

const express = require('express');
const app = express();

// 반드시 Render가 감지할 수 있는 포트를 사용해야 함
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('🟢 Me2Verse 백엔드 루트 정상 작동 중!');
});

app.get('/ping', (req, res) => {
  res.send('✅ Ping OK: Render 연결 정상');
});

app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
