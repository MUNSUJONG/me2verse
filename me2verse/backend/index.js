const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('🟢 Me2Verse 백엔드가 정상 작동 중입니다.');
});

app.get('/ping', (req, res) => {
  res.send('🟢 Render 서버 정상 작동 중');
});

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});