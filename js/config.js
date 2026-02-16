// js/config.js

// 1. Firebase 설정 (Client Side)
export const firebaseConfig = {
    apiKey: "AIzaSyCfHl21wWPmhB-3OjcX5-OJGnZq4_Km2n0",
    authDomain: "words-8e6db.firebaseapp.com",
    databaseURL: "https://words-8e6db-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "words-8e6db",
    storageBucket: "words-8e6db.firebasestorage.app",
    messagingSenderId: "870198994885",
    appId: "1:870198994885:web:11bcb2fa9ee155ab7b4dac"
};

// 2. 외부 API 키
export const API_KEYS = {
    GOOGLE_TRANSLATE: "AIzaSyAdXvE2SkyEbPmUXtLUeVi7f-niGpXUu_0", // 주의: 프론트 노출 위험 있음 (개인용이라 허용)
    MERRIAM_WEBSTER: "02d1892d-8fb1-4e2d-bc43-4ddd4a47eab3"
};

// 3. 보안 설정
export const SECURITY = {
    ALLOWED_EMAIL: "puroome@gmail.com"
};

// 4. 구글 앱스 스크립트(GAS) URL (배포 후 여기에 채워넣어야 해!)
export const GAS_SCRIPT_URL = "여기에_GAS_웹앱_URL을_붙여넣으세요"; 

// 5. 전역 상태 관리 (Singleton State)
export const state = {
    wordList: [],      // 전체 단어 목록
    userSettings: {
        voiceType: 'US', // 'US' or 'UK'
        theme: 'light'
    },
    studySession: {
        startTime: null,
        totalTime: 0
    }
};
