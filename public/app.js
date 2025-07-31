const loginBtn = document.getElementById('loginBtn');
const payBtn = document.getElementById('payBtn');
const statusMsg = document.getElementById('statusMsg');

let currentUser = null;

loginBtn.addEventListener('click', async () => {
  try {
    if (!window.Pi) {
      statusMsg.textContent = '❌ Pi SDK가 로드되지 않았습니다.';
      return;
    }

    const scopes = ['username', 'payments'];
    Pi.init({ version: "2.0" });

    currentUser = await Pi.authenticate(scopes, onIncompletePaymentFound);
    statusMsg.textContent = `✅ 로그인 성공: ${currentUser.username}`;
  } catch (error) {
    console.error(error);
    statusMsg.textContent = '❌ 로그인 실패: ' + error.message;
  }
});

payBtn.addEventListener('click', async () => {
  if (!currentUser) {
    statusMsg.textContent = '❌ 먼저 로그인 해주세요.';
    return;
  }

  statusMsg.textContent = '💳 결제 생성 중...';

  try {
    const paymentData = {
      amount: 1,
      memo: "Me2Verse 테스트 결제",
      metadata: { type: "test", app: "me2verse" }
    };

    await Pi.createPayment(paymentData, {
      onReadyForServerApproval: async (paymentId) => {
        statusMsg.textContent = '🔄 서버 승인 중...';
        await fetch("https://me2verse-backend.onrender.com/approve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId })
        });
      },
      onReadyForServerCompletion: async (paymentId, txid) => {
        await fetch("https://me2verse-backend.onrender.com/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId, txid })
        });
        statusMsg.textContent = '🎉 결제가 성공적으로 완료되었습니다!';
      },
      onCancel: (paymentId) => {
        statusMsg.textContent = '❌ 결제가 취소되었습니다.';
      },
      onError: (error) => {
        statusMsg.textContent = '❌ 결제 중 오류 발생: ' + error.message;
      }
    });

  } catch (error) {
    statusMsg.textContent = '❌ 결제 실패: ' + error.message;
  }
});