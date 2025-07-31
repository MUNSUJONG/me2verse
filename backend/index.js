const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/ping', (req, res) => {
  res.send('🟢 Render 서버 정상 작동 중');
});

app.post('/approve', (req, res) => {
  const { paymentId } = req.body;
  console.log(`✅ 결제 승인 처리: ${paymentId}`);
  res.json({ status: 'approved' });
});

app.post('/complete', (req, res) => {
  const { paymentId, txid } = req.body;
  console.log(`🎉 결제 완료 처리: ${paymentId}, TXID: ${txid}`);
  res.json({ status: 'completed' });
});

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});