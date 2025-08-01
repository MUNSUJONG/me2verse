// backend/index.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Me2Verse Backend is running!');
});

app.get('/ping', (req, res) => {
  res.send('🟢 Render 서버 정상 작동 중');
});

app.post('/process-payment', (req, res) => {
  const { paymentId } = req.body;

  if (!paymentId) {
    return res.status(400).json({ error: 'paymentId 없음' });
  }

  console.log(`✅ 승인 요청 도착: ${paymentId}`);
  // 여기서 승인 로직 또는 기록 로직 수행 가능

  return res.json({ message: '서버에서 승인 완료' });
});

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
