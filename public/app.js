const loginBtn = document.getElementById('loginBtn');
const payBtn = document.getElementById('payBtn');
const statusMsg = document.getElementById('statusMsg');

let currentUser = null;

loginBtn.addEventListener('click', async () => {
  console.log('👉 로그인 버튼 클릭됨');

  if (!window.Pi) {
    statusMsg.textContent = '❌ Pi SDK가 로드되지 않았습니다.';
    console.error('❌ window.Pi is undefined');
    return;
  }

  try {
    statusMsg.textContent = '⏳ 로그인 중...';
    console.log('🔄 Pi.authenticate() 호출 시작');

    const scopes = ['username', 'payments'];
    const user = await Pi.authenticate(scopes, onIncompletePaymentFound);

    console.log('✅ Pi 인증 성공:', user);
    currentUser = user;
    statusMsg.textContent = `✅ 로그인 성공: ${user.username}`;
  } catch (error) {
    console.error('❌ Pi 인증 실패:', error);
    statusMsg.textContent = '❌ Login failed: ' + error.message;
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
        console.log('🔗 결제 승인 대기 중 (paymentId):', paymentId);
        statusMsg.textContent = '🔄 서버 승인 중...';

        await fetch("https://your-render-server-url/approve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId })
        });
      },
      onReadyForServerCompletion: async (paymentId, txid) => {
        console.log('✅ 결제 승인 완료 → 완료 요청', { paymentId, txid });

        await fetch("https://your-render-server-url/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId, txid })
        });

        statusMsg.textContent = '🎉 결제가 성공적으로 완료되었습니다!';
      },
      onCancel: (paymentId) => {
        console.warn('🚫 사용자가 결제를 취소함:', paymentId);
        statusMsg.textContent = '❌ 결제가 취소되었습니다.';
      },
      onError: (error, payment) => {
        console.error('❗ 결제 오류 발생:', error);
        statusMsg.textContent = '❌ 결제 중 오류 발생: ' + error.message;
      }
    });

  } catch (error) {
    console.error('❗ 결제 생성 실패:', error);
    statusMsg.textContent = '❌ 결제 실패: ' + error.message;
  }
});

function onIncompletePaymentFound(payment) {
  console.warn('⚠️ 미완료 결제 발견:', payment);
}
