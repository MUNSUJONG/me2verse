// public/app.js

document.addEventListener("DOMContentLoaded", () => {
  // ✅ Pi SDK 초기화 (샌드박스 보장 + 늦게 실행)
  if (window.Pi) {
    Pi.init({
      version: "2.0",
      sandbox: true
    });
    console.log("🟢 Pi SDK 초기화 완료");
  } else {
    console.error("❌ Pi SDK가 window에 없습니다.");
  }

  const loginBtn = document.getElementById("loginBtn");
  const payBtn = document.getElementById("payBtn");
  const statusMsg = document.getElementById("statusMsg");

  let currentUser = null;

  // ✅ Pi 로그인 처리
  loginBtn.addEventListener("click", async () => {
    if (!window.Pi) {
      statusMsg.textContent = "❌ Pi SDK가 로드되지 않았습니다.";
      return;
    }

    try {
      const scopes = ["username", "payments"];
      const user = await Pi.authenticate(scopes);
      currentUser = user;
      console.log("✅ 로그인 성공:", user);
      statusMsg.textContent = `✅ ${user.username} 님 환영합니다!`;
    } catch (error) {
      console.error("❌ 로그인 실패:", error);
      statusMsg.textContent = `❌ 로그인 실패: ${error?.message || JSON.stringify(error)}`;
    }
  });

  // ✅ 결제 버튼 처리
  payBtn.addEventListener("click", async () => {
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
});
