const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/ping', (req, res) => {
  res.send('🟢 Render 서버 정상 작동 중');
});

app.post('/approve', (req, res) => {
  const { paymentId } = req.body;
  if (!paymentId) return res.status(400).json({ error: 'Missing paymentId' });
  console.log('✅ 승인 완료:', paymentId);
  res.json({ status: 'approved' });
});

app.post('/complete', (req, res) => {
  const { paymentId, txid } = req.body;
  if (!paymentId || !txid) return res.status(400).json({ error: 'Missing paymentId or txid' });
  console.log('🎉 결제 완료 처리됨:', { paymentId, txid });
  res.json({ status: 'completed' });
});

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
