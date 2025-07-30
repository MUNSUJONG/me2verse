const loginBtn = document.getElementById('loginBtn');
const payBtn = document.getElementById('payBtn');
const statusMsg = document.getElementById('statusMsg');
let currentUser = null;
loginBtn.addEventListener('click', async () => {
  if (!window.Pi) {
    statusMsg.textContent = '❌ Pi SDK가 로드되지 않았습니다.';
    return;
  }
  try {
    const scopes = ['username', 'payments'];
    const user = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
    currentUser = user;
    statusMsg.textContent = `✅ 로그인 성공: ${user.username}`;
  } catch (err) {
    statusMsg.textContent = `❌ 로그인 실패: ${err}`;
  }
});
payBtn.addEventListener('click', async () => {
  if (!currentUser) {
    statusMsg.textContent = '⚠️ 먼저 로그인하세요.';
    return;
  }
  try {
    const paymentData = {
      amount: 1,
      memo: 'Me2Verse 결제 테스트',
      metadata: { user: currentUser.username }
    };
    await window.Pi.createPayment(paymentData, {

mkdir -p me2verse/public me2verse/backend me2verse
cd me2verse

# 1. public/index.html
cat <<EOF > public/index.html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Me2Verse</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <h1>🌸 Me2Verse 테스트 로그인/결제</h1>
  <button id="loginBtn" class="btn login">Pi 로그인</button>
  <button id="payBtn" class="btn pay">결제</button>
  <p id="statusMsg"></p>
  <script src="app.js"></script>
</body>
</html>
