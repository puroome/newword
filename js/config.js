// js/config.js

const CONFIG = {
    // 1. Google Sheets 설정
    GOOGLE_SHEET: {
        ID: "1wvOW-2iz2dAgg_ohq2-avR5HkjwdTqxkDid46A9EgwQ",
        RANGE: "word!A:H", // word 시트의 전체 범위
        API_KEY: "AIzaSyAdXvE2SkyEbPmUXtLUeVi7f-niGpXUu_0" 
    },

    // 2. Merriam-Webster Dictionary API 설정
    DICTIONARY_API: {
        KEY: "02d1892d-8fb1-4e2d-bc43-4ddd4a47eab3",
        URL: "https://dictionaryapi.com/api/v3/references/learners/json/"
    },

    // 3. Firebase 설정
    FIREBASE: {
        apiKey: "AIzaSyCfHl21wWPmhB-3OjcX5-OJGnZq4_Km2n0",
        authDomain: "words-8e6db.firebaseapp.com",
        databaseURL: "https://words-8e6db-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "words-8e6db",
        storageBucket: "words-8e6db.firebasestorage.app",
        messagingSenderId: "870198994885",
        appId: "1:870198994885:web:11bcb2fa9ee155ab7b4dac"
    }
};

// 전역에서 사용할 수 있도록 window 객체에 할당
window.CONFIG = CONFIG;
