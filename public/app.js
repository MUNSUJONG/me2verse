// public/app.js

const loginBtn = document.getElementById('loginBtn');
const payBtn = document.getElementById('payBtn');
const statusMsg = document.getElementById('statusMsg');

const BACKEND_URL = "https://me2verse11.onrender.com"; // ✔ 정확한 백엔드 주소

let currentUser = null;

loginBtn.addEventListener('click', async () => {
  try {
    if (!window.Pi) {
      statusMsg.textContent = '❌ Pi SDK가 로드되지 않았습니다.';
      return;
    }

    const scopes = ['username', 'payments'];
    Pi.authenticate(scopes, function (authResult) {
      if (authResult.user) {
        currentUser = authResult.user;
        statusMsg.textContent = `✅ 로그인 완료: ${currentUser.username}`;
        console.log("Pi 로그인 성공:", currentUser);
      } else {
        statusMsg.textContent = '❌ 로그인 실패';
      }
    });
  } catch (error) {
    console.error("로그인 에러:", error);
    statusMsg.textContent = '❌ 로그인 중 에러 발생';
  }
});

payBtn.addEventListener('click', async () => {
  if (!currentUser) {
    statusMsg.textContent = '⚠️ 먼저 로그인해주세요';
    return;
  }

  statusMsg.textContent = '💰 결제 요청 중...';

  const paymentData = {
    amount: 1,
    memo: "Me2Verse Demo 결제",
    metadata: { itemId: "me2verse-demo-001" }
  };

  Pi.createPayment(paymentData, {
    onReadyForServerApproval: async (paymentId) => {
      console.log("서버 승인 요청:", paymentId);
      await fetch(`${BACKEND_URL}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId })
      });
    },
    onReadyForServerCompletion: async (paymentId, txid) => {
      console.log("서버 결제 완료 요청:", paymentId, txid);
      await fetch(`${BACKEND_URL}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, txid })
      });
    },
    onCancel: (paymentId) => {
      console.warn("사용자가 결제 취소:", paymentId);
      statusMsg.textContent = '❌ 결제가 취소되었습니다.';
    },
    onError: (error, payment) => {
      console.error("결제 중 오류:", error, payment);
      statusMsg.textContent = '❌ 결제 중 오류 발생';
    }
  });
});
