// public/app.js
const loginBtn = document.getElementById('loginBtn');
const payBtn = document.getElementById('payBtn');
const statusMsg = document.getElementById('statusMsg');

let currentUser = null;

loginBtn.addEventListener('click', async () => {
  if (!window.Pi) {
    statusMsg.textContent = '❌ Pi 브라우저에서 열어주세요 (sandbox.minepi.com)';
    return;
  }

  try {
    const scopes = ['username'];
    const authResult = await window.Pi.authenticate(scopes);
    currentUser = authResult.user;
    statusMsg.textContent = `✅ 로그인 완료: @${currentUser.username}`;
  } catch (error) {
    statusMsg.textContent = '❌ 로그인 실패';
    console.error(error);
  }
});

payBtn.addEventListener('click', async () => {
  if (!window.Pi) {
    statusMsg.textContent = '❌ Pi 브라우저에서 열어주세요';
    return;
  }

  if (!currentUser) {
    statusMsg.textContent = '⚠️ 먼저 로그인해주세요';
    return;
  }

  try {
    const payment = await Pi.createPayment({
      amount: 1,
      memo: "Me2Verse 테스트 결제",
      metadata: { type: "demo", user: currentUser.username },
    }, {
      onReadyForServerApproval: async (paymentId) => {
        statusMsg.textContent = '📡 서버 승인 요청 중...';
        await fetch('https://me2verse11-backend.onrender.com/process-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId })
        });
      },
      onReadyForServerCompletion: () => {
        statusMsg.textContent = '💎 결제 완료 대기 중...';
      },
      onCancel: () => {
        statusMsg.textContent = '❌ 결제 취소됨';
      },
      onError: (err) => {
        statusMsg.textContent = '🚨 결제 오류 발생';
        console.error(err);
      },
    });
  } catch (err) {
    statusMsg.textContent = '🚫 결제 실패';
    console.error(err);
  }
});

