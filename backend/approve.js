    const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const { paymentId, txid } = req.body;
  console.log('💰 승인 요청 수신:', paymentId, txid);

  if (!paymentId || !txid) {
    return res.status(400).json({ error: '데이터 누락' });
  }

  res.status(200).json({ status: 'completed' });
});

module.exports = router;
