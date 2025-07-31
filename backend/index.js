const express = require('express');
const cors = require('cors');
const approveRouter = require('./approve');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('🟢 Me2Verse 백엔드 루트 정상 작동 중!');
});

app.get('/ping', (req, res) => {
  res.send('✅ Ping OK: Render 연결 정상');
});

app.use('/approve', approveRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
