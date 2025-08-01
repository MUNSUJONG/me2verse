payBtn.addEventListener('click', async () => {
  if (!currentUser || !currentUser.username) {
    statusMsg.textContent = "❌ 먼저 로그인해주세요.";
    return;
  }

  const paymentData = {
    amount: 1,
    memo: "Me2Verse 결제 테스트",
    metadata: { purpose: "test" }
  };

  Pi.createPayment(paymentData, {
    onReadyForServerApproval: async (paymentId) => {
      statusMsg.textContent = "📡 결제 승인 요청 중...";

      try {
        const res = await fetch("https://me2verse11.onrender.com/approve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId })
        });

        const result = await res.json();
        console.log("✅ 승인 응답:", result);
      } catch (error) {
        console.error("❌ 승인 오류:", error);
        statusMsg.textContent = "❌ 서버 승인 중 오류 발생!";
      }
    },

    onReadyForServerCompletion: async (paymentId, txid) => {
      statusMsg.textContent = "✅ 결제 완료 처리 중...";

      try {
        const res = await fetch("https://me2verse11.onrender.com/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId, txid })
        });

        const result = await res.json();
        console.log("🎉 완료 응답:", result);
        statusMsg.textContent = "🎉 결제 완료!";
      } catch (error) {
        console.error("❌ 완료 오류:", error);
        statusMsg.textContent = "❌ 결제 완료 처리 중 오류 발생!";
      }
    },

    onCancel: (paymentId) => {
      statusMsg.textContent = "🚫 결제가 취소되었습니다.";
    },

    onError: (error, payment) => {
      console.error("❌ 결제 오류:", error);
      statusMsg.textContent = "❌ 결제 중 오류 발생!";
    }
  });
});
