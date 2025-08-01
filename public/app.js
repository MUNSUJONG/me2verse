// public/app.js

const loginBtn = document.getElementById('loginBtn');
const payBtn = document.getElementById('payBtn');
const statusMsg = document.getElementById('statusMsg');

const BACKEND_URL = "https://me2verse11.onrender.com";

let currentUser = null;

// 로그인
loginBtn.addEventListener('click', async () => {
  try {
    if (!window.Pi) {
      statusMsg.textContent = '❌ Pi SDK가 로드되지 않았습니다.';
      return;
    }

    const scopes = ['username', 'payments'];
    Pi.authenticate(scopes, onLoginSuccess, onLoginFailure);
  } catch (error) {
    statusMsg.textContent = `로그인 오류: ${error.message}`;
  }
});

function onLoginSuccess(user) {
  currentUser = user;
  statusMsg.textContent = `✅ 로그인 성공: ${user.username}`;
}

function onLoginFailure(error) {
  statusMsg.textContent = `❌ 로그인 실패: ${error}`;
}

// 결제
payBtn.addEventListener('click', async () => {
  if (!currentUser) {
    statusMsg.textContent = "❌ 먼저 로그인해주세요.";
    return;
  }

  const paymentData = {
    amount: 1,
    memo: "Me2Verse Pi 결제 테스트",
    metadata: { type: "test" }
  };

  Pi.createPayment(paymentData, {
    onReadyForServerApproval: async (paymentId) => {
      statusMsg.textContent = `⏳ 결제 승인 요청 중...`;

      await fetch(`${BACKEND_URL}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId })
      });
    },
    onReadyForServerCompletion: async (paymentId, txid) => {
      statusMsg.textContent = `📦 결제 승인됨! 완료 처리 중...`;

      await fetch(`${BACKEND_URL}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, txid })
      });
    },
    onCancel: (paymentId) => {
      statusMsg.textContent = `❌ 사용자가 결제를 취소했습니다.`;
    },
    onError: (error, payment) => {
      statusMsg.textContent = `🚫 결제 오류 발생: ${error}`;
    }
  });
});
