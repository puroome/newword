/**
 * ⚙️ config.js
 * 앱의 모든 설정값, API 키, 전역 상태를 관리합니다.
 */

// 1. API Keys & Endpoints
export const CONFIG = {
    // Google Apps Script 배포 URL (위에서 복사한 것 붙여넣기)
    GAS_APP_URL: "https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec", 
    
    // Merriam-Webster Dictionary API Key
    DICTIONARY_API_KEY: "02d1892d-8fb1-4e2d-bc43-4ddd4a47eab3",
    
    // Google API Key (번역 등 일반 용도)
    GOOGLE_API_KEY: "AIzaSyAdXvE2SkyEbPmUXtLUeVi7f-niGpXUu_0",

    // 허용된 사용자 이메일 (보안용)
    ALLOWED_USER_EMAIL: "puroome@gmail.com"
};

// 2. Firebase Config (제공해주신 정보)
export const FIREBASE_CONFIG = {
    apiKey: "AIzaSyCfHl21wWPmhB-3OjcX5-OJGnZq4_Km2n0",
    authDomain: "words-8e6db.firebaseapp.com",
    databaseURL: "https://words-8e6db-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "words-8e6db",
    storageBucket: "words-8e6db.firebasestorage.app",
    messagingSenderId: "870198994885",
    appId: "1:870198994885:web:11bcb2fa9ee155ab7b4dac"
};

// 3. Image Assets Paths (이미지 경로 매핑)
export const ASSETS = {
    ICONS: {
        ADD: "images/cat-add.png",
        DELIVERY: "images/cat-delivery.png", // 로딩이나 전송 중일 때 사용 추천
        EDIT: "images/cat-edit.png",
        REMOVE: "images/cat-remove.png",
        LEARN: "images/learn.png",
        QUIZ_1: "images/quiz1.png",
        QUIZ_2: "images/quiz2.png",
        QUIZ_3: "images/quiz3.png",
        TEST: "images/test.png"
    }
};

// 4. Global State (앱 전체에서 공유하는 데이터)
export const state = {
    wordList: [],           // 전체 단어 목록 (Firebase에서 로드)
    filteredList: [],       // 검색/필터링된 목록
    currentWordIndex: 0,    // 학습 모드에서 현재 보고 있는 단어 인덱스
    voiceType: 'UK',        // 'UK' or 'US' (기본값 영국식)
    
    // 학습 기록 (localStorage와 연동됨)
    studyStats: {
        totalTime: 0,       // 총 학습 시간(초)
        cardsFlipped: 0,    // 뒤집은 카드 수
        quizCorrect: 0,     // 퀴즈 정답 수
        quizWrong: 0        // 퀴즈 오답 수
    },

    // UI 상태
    isLoading: true,
    isQuizMode: false
};
