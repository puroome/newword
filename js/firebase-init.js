// js/firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getDatabase, ref, set, get, update } 
from "https://www.gstatic.com/firebasejs/12.9.0/firebase-database.js";

// config.js에서 설정 가져오기
const firebaseConfig = window.CONFIG.FIREBASE;

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

// 전역 변수로 내보내기 (다른 파일에서 사용하기 위해)
window.auth = auth;
window.db = db;

// --- 로그인/로그아웃 로직 ---

// 1. 로그인 버튼 클릭 이벤트
const loginBtn = document.getElementById('google-login-btn');
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log("로그인 성공:", result.user.email);
                // 로그인 성공 시 메인 화면으로 전환은 onAuthStateChanged에서 처리
            }).catch((error) => {
                console.error("로그인 에러:", error);
                alert("로그인에 실패했습니다.");
            });
    });
}

// 2. 로그아웃 버튼 클릭 이벤트
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => {
            console.log("로그아웃 성공");
            alert("로그아웃 되었습니다.");
        }).catch((error) => {
            console.error("로그아웃 에러:", error);
        });
    });
}

// 3. 인증 상태 변화 감지 (로그인 유지 확인)
onAuthStateChanged(auth, (user) => {
    const loginPage = document.getElementById('login-page');
    const mainPage = document.getElementById('main-page');

    if (user) {
        // 로그인 된 상태
        loginPage.classList.remove('active');
        loginPage.classList.add('hidden');
        
        mainPage.classList.remove('hidden');
        mainPage.classList.add('active');
        
        console.log("현재 사용자:", user.email);
        // 여기서 데이터 로드 등을 시작할 수 있습니다.
    } else {
        // 로그아웃 된 상태
        mainPage.classList.remove('active');
        mainPage.classList.add('hidden');
        
        loginPage.classList.remove('hidden');
        loginPage.classList.add('active');
    }
});
