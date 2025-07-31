// backend/index.js

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

// 기본 루트 테스트용
app.get('/', (req, res) => {
  res.send('🟢 Me2Verse 백엔드 루트 정상 작동 중!');
});

// 추가 라우터 예시
app.get('/ping', (req, res) => {
  res.send('✅ Ping OK: 서버 응답 정상');
});

// JSON 요청 처리를 위한 미들웨어
app.use(express.json());

// POST 테스트용
app.post('/test', (req, res) => {
  const { message } = req.body;
  res.json({ reply: `받은 메시지: ${message}` });
});

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
