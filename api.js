// js/api.js
import { firebaseConfig, GAS_SCRIPT_URL } from './config.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js"; // 버전 명시
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// 1. Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db);

// 2. 데이터 읽기 (Read from Firebase) - 아주 빠름
export async function fetchAllWords() {
    console.log("🔥 Firebase에서 데이터 로딩 중...");
    try {
        const snapshot = await get(child(dbRef, `words`));
        if (snapshot.exists()) {
            const data = snapshot.val();
            // 객체(Object)를 배열(Array)로 변환하여 반환
            // 예: { "apple": {...}, "banana": {...} } -> [ {...}, {...} ]
            return Object.values(data);
        } else {
            console.log("데이터가 없습니다.");
            return [];
        }
    } catch (error) {
        console.error("Firebase 로딩 실패:", error);
        return [];
    }
}

// 3. 쓰기 작업 (Write via GAS) - GAS가 처리 후 Firebase 동기화
// Fetch API를 사용하여 GAS 웹앱 URL로 요청을 보냅니다.

export async function createWord(wordData) {
    // wordData 예시: { word: "apple", meaning: "사과", ... }
    const params = new URLSearchParams({
        action: 'create_word',
        ...wordData
    });

    console.log("📤 GAS에 저장 요청:", wordData.word);
    
    // CORS 문제 회피를 위해 no-cors를 쓸 수도 있지만, 
    // GAS 배포 시 '모든 사용자' 권한이면 일반 fetch로 가능
    return fetch(`${GAS_SCRIPT_URL}?${params.toString()}`, {
        method: "GET", // GAS doGet은 GET으로 받음
        mode: "cors"
    }).then(res => res.json());
}

export async function updateWord(originalWord, updateData) {
    // updateData 예시: { meaning: "새로운 뜻" }
    const params = new URLSearchParams({
        action: 'update_word_data',
        original_word: originalWord,
        ...updateData
    });

    console.log("📝 GAS에 수정 요청:", originalWord);
    return fetch(`${GAS_SCRIPT_URL}?${params.toString()}`).then(res => res.json());
}

export async function deleteWord(word) {
    const params = new URLSearchParams({
        action: 'delete_word',
        word: word
    });

    console.log("🗑️ GAS에 삭제 요청:", word);
    return fetch(`${GAS_SCRIPT_URL}?${params.toString()}`).then(res => res.json());
}

// 4. 외부 사전 API (Merriam-Webster)
export async function fetchDefinition(word, apiKey) {
    const url = `https://dictionaryapi.com/api/v3/references/learners/json/${word}?key=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data; // 이 데이터 파싱은 quiz.js나 ui.js에서 처리
    } catch (e) {
        console.error("사전 API 오류:", e);
        return null;
    }
}
