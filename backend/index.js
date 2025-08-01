const express = require('express');
const cors = require('cors');
const app = express();

// Render에서는 반드시 이 포트를 사용해야 정상 배포됨
const PORT = process.env.PORT || 3000;

// CORS 허용 + JSON 파싱
app.use(cors());
app.use(express.json());

// ✅ 루트 테스트
app.get('/', (req, res) => {
  res.send('🟢 Me2Verse 백엔드 루트 정상 작동 중!');
});

// ✅ Render 상태 확인용 ping
app.get('/ping', (req, res) => {
  res.send('✅ Ping OK: Render 연결 정상');
});

// ✅ 결제 승인 처리 (Pi SDK: onReadyForServerApproval)
app.post('/approve', (req, res) => {
  const { paymentId } = req.body;

  if (!paymentId) {
    console.error('❌ [승인] paymentId 누락');
    return res.status(400).json({ error: '❌ paymentId 누락' });
  }

  console.log(`📡 [승인] 요청 수신: paymentId = ${paymentId}`);
  // 여기에 승인 관련 로직 또는 DB 저장 등 추가 가능

  res.json({ success: true, paymentId });
});

// ✅ 결제 완료 처리 (Pi SDK: onReadyForServerCompletion)
app.post('/complete', (req, res) => {
  const { paymentId, txid } = req.body;

  if (!paymentId || !txid) {
    console.error('❌ [완료] paymentId 또는 txid 누락');
    return res.status(400).json({ error: '❌ paymentId 또는 txid 누락' });
  }

  console.log(`🎉 [완료] 요청 수신: paymentId = ${paymentId}, txid = ${txid}`);
  // 여기서 실제 결제 DB 반영 등 처리 가능

  res.json({ success: true, paymentId, txid });
});

// ✅ 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});
