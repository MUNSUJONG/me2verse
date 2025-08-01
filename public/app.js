
function initPi() {
  if (!window.Pi) {
    statusMsg.textContent = '❌ Pi SDK 로드 실패 (Pi Browser에서 실행하세요)';
    return;
  }

  window.Pi.init({ version: "2.0" });
  console.log("✅ Pi SDK Initialized");
}

// 로그인 버튼
loginBtn.addEventListener('click', async () => {
  initPi();

  try {
    const scopes = ['username', 'payments'];
    const onIncompletePaymentFound = (payment) => {
      console.warn('미완료 결제 발견:', payment);
    };

    const authResult = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
    currentUser = authResult.user;
    statusMsg.textContent = `✅ 로그인 성공: ${currentUser.username}`;
    console.log("🔐 로그인 결과:", authResult);
  } catch (err) {
    console.error('❌ 로그인 오류:', err);
    statusMsg.textContent = '❌ 로그인 실패';
  }
});

// 결제 버튼
payBtn.addEventListener('click', async () => {
  if (!currentUser) {
    statusMsg.textContent = '⚠️ 먼저 로그인해주세요';
    return;
  }

  try {
    const paymentData = {
      amount: 1,
      memo: "Me2Verse 테스트 결제",
      metadata: { type: "test", project: "me2verse" }
    };

    const callbacks = {
      onReadyForServerApproval: async (paymentId) => {
        statusMsg.textContent = `🛰 서버 승인 요청 중... (${paymentId})`;
        await fetch("https://me2verse11-backend.onrender.com/approve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId })
        });
      },
      onReadyForServerCompletion: async (paymentId, txid) => {
        statusMsg.textContent = `🔄 서버 결제 완료 중... (${txid})`;
        await fetch("https://me2verse11-backend.onrender.com/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId, txid })
        });
        statusMsg.textContent = `🎉 결제 완료! TXID: ${txid}`;
      },
      onCancel: (paymentId) => {
        statusMsg.textContent = `❌ 결제 취소됨 (${paymentId})`;
      },
      onError: (error, payment) => {
        console.error('💥 결제 에러:', error);
        statusMsg.textContent = '💥 결제 중 에러 발생';
      }
    };

    await window.Pi.createPayment(paymentData, callbacks);
  } catch (err) {
    console.error('💥 결제 실패:', err);
    statusMsg.textContent = '❌ 결제 실패';
  }
});

