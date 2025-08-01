const express = require('express');
const app = express();
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const PI_API_KEY = process.env.PI_API_KEY;

const SERVER_HEADER = {
  Authorization: `Key ${PI_API_KEY}`
};

app.get('/ping', (req, res) => {
  res.send('🟢 Me2Verse Node 서버 작동 중');
});

app.post('/payment/approve', async (req, res) => {
  try {
    const { paymentId } = req.body;
    const url = `https://api.minepi.com/v2/payments/${paymentId}/approve`;
    const result = await axios.post(url, {}, { headers: SERVER_HEADER });
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/payment/complete', async (req, res) => {
  try {
    const { paymentId, txid } = req.body;
    const url = `https://api.minepi.com/v2/payments/${paymentId}/complete`;
    const result = await axios.post(url, { txid }, { headers: SERVER_HEADER });
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/payment/cancel', async (req, res) => {
  try {
    const { paymentId } = req.body;
    const url = `https://api.minepi.com/v2/payments/${paymentId}/cancel`;
    const result = await axios.post(url, {}, { headers: SERVER_HEADER });
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/payment/error', async (req, res) => {
  try {
    const { paymentId } = req.body;
    const url = `https://api.minepi.com/v2/payments/${paymentId}/cancel`;
    const result = await axios.post(url, {}, { headers: SERVER_HEADER });
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
