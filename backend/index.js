// 📁 backend/index.js

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어
app.use(express.json());

// ✅ 서버 상태 확인용 라우트
app.get('/ping', (req, res) => {
  res.send('🟢 Render 서버 정상 작동 중');
});

// ✅ 기본 라우트
app.get('/', (req, res) => {
  res.send('Me2Verse Backend is running!');
});

// ✅ 결제 승인 처리
app.post('/approve', (req, res) => {
  const { paymentId } = req.body;
  if (!paymentId) {
    return res.status(400).json({ error: 'paymentId is required' });
  }
  console.log(`✅ 결제 승인 요청 수신: ${paymentId}`);
  return res.json({ status: 'payment approved' });
});

// ✅ 결제 완료 처리
app.post('/complete', (req, res) => {
  const { paymentId, txid } = req.body;
  if (!paymentId || !txid) {
    return res.status(400).json({ error: 'paymentId와 txid는 필수입니다' });
  }
  console.log(`🎉 결제 완료 처리: ${paymentId}, 트랜잭션 ID: ${txid}`);
  return res.json({ status: 'payment completed' });
});

// ✅ 결제 요청 처리
app.post('/payment', (req, res) => {
  const { amount, memo, user } = req.body;
  if (!amount || !memo || !user) {
    return res.status(400).json({ error: 'amount, memo, user는 필수입니다' });
  }
  console.log(`💰 결제 요청: ${user} - ${amount} Pi - ${memo}`);
  return res.json({ status: 'payment initiated' });
});

// ✅ 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 Me2Verse 백엔드 실행 중: http://localhost:${PORT}`);
});
