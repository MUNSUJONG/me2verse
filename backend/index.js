const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('🟢 Me2Verse 백엔드 루트 정상 작동 중!');
});

app.get('/ping', (req, res) => {
  res.send('✅ Ping OK: Render 연결 정상');
});

app.post('/approve', (req, res) => {
  const { paymentId } = req.body;
  if (!paymentId) {
    return res.status(400).json({ error: "❌ paymentId 누락" });
  }
  console.log("📡 결제 승인 요청 수신:", paymentId);
  res.json({ success: true, paymentId });
});

app.post('/complete', (req, res) => {
  const { paymentId, txid } = req.body;
  if (!paymentId || !txid) {
    return res.status(400).json({ error: "❌ paymentId 또는 txid 누락" });
  }
  console.log("🎉 결제 완료 요청 수신:", paymentId, txid);
  res.json({ success: true, paymentId, txid });
});

app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
