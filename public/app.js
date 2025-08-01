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

payBtn.addEventListener('click', async
