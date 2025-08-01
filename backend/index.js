// backend/index.js

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 상태 확인용
app.get('/', (req, res) => {
  res.send('🟢 Me2Verse 백엔드 루트 정상 작동 중!');
});

// 결제 승인
app.post('/approve', (req, res) => {
  const { paymentId } = req.body;

  if (!paymentId) {
    return res.status(400).json({ error: 'paymentId 누락됨' });
  }

  console.log(`✅ 결제 승인 요청 수신: ${paymentId}`);
  res.json({ status: 'approved', paymentId });
});

// 결제 완료
app.post('/complete', (req, res) => {
  const { paymentId, txid } = req.body;

  if (!paymentId || !txid) {
    return res.status(400).json({ error: 'paymentId 또는 txid 누락됨' });
  }

  console.log(`🎉 결제 완료 요청 수신: paymentId=${paymentId}, txid=${txid}`);
  res.json({ status: 'completed', paymentId, txid });
});

app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});
