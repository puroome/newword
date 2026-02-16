/**
 * 📡 api.js
 * 데이터 통신 담당 (Firebase Read / GAS Write)
 */
import { CONFIG, state, FIREBASE_CONFIG } from './config.js';
import { storage } from './utils.js';

// Firebase SDK 로드 (CDN 방식)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Firebase 초기화
const app = initializeApp(FIREBASE_CONFIG);
const dbRef = ref(getDatabase(app));

// 1. 전체 단어 목록 가져오기 (Firebase -> App)
export async function loadWordList() {
    try {
        console.log("📥 Firebase에서 데이터 로딩 중...");
        
        // 캐시 확인 (속도 향상)
        const cachedData = storage.load('wordListCache');
        if (cachedData && (Date.now() - cachedData.timestamp < 1000 * 60 * 60)) { // 1시간 캐시
            console.log("✅ 캐시된 데이터 사용");
            state.wordList = cachedData.list;
            return state.wordList;
        }

        const snapshot = await get(child(dbRef, `words`));
        if (snapshot.exists()) {
            const data = snapshot.val();
            // 객체를 배열로 변환
            state.wordList = Object.values(data);
            
            // 캐시 저장
            storage.save('wordListCache', { list: state.wordList, timestamp: Date.now() });
            console.log(`✅ ${state.wordList.length}개 단어 로드 완료`);
            return state.wordList;
        } else {
            console.log("⚠️ 데이터가 없습니다.");
            return [];
        }
    } catch (error) {
        console.error("❌ Firebase 로드 실패:", error);
        return [];
    }
}

// 2. 단어 추가/수정/삭제 요청 보내기 (App -> GAS)
// GAS는 작업을 수행하고 Firebase를 업데이트함 (Read-Write 분리)
async function sendToGAS(params) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${CONFIG.GAS_APP_URL}?${queryString}`;
    
    try {
        const response = await fetch(url, { method: "POST" }); // CORS 문제 회피를 위해 POST 또는 no-cors 고려
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("❌ GAS 통신 오류:", error);
        // 오류가 나도 낙관적 업데이트(Optimistic Update)로 인해 앱은 멈추지 않음
        return { status: "error" };
    }
}

// 3. [CRUD] 단어 추가
export async function createWord(wordData) {
    // 1) 화면에 즉시 반영 (Optimistic UI)
    state.wordList.push(wordData);
    document.dispatchEvent(new Event('wordListUpdated'));

    // 2) 서버로 전송
    await sendToGAS({
        action: 'create_word',
        word: wordData.Word,
        pos: wordData.POS,
        meaning: wordData.Meaning,
        explanation: wordData.Explanation,
        sample: wordData.Sample
    });
}

// 4. [CRUD] 단어 수정
export async function updateWord(originalWord, newData) {
    // 1) 화면 반영
    const index = state.wordList.findIndex(w => w.Word === originalWord);
    if (index !== -1) {
        state.wordList[index] = { ...state.wordList[index], ...newData };
        document.dispatchEvent(new Event('wordListUpdated'));
    }

    // 2) 서버 전송
    await sendToGAS({
        action: 'update_word_data',
        originalWord: originalWord,
        newWord: newData.Word,
        pos: newData.POS,
        meaning: newData.Meaning,
        explanation: newData.Explanation,
        sample: newData.Sample
    });
}

// 5. [CRUD] 단어 삭제
export async function deleteWord(word) {
    // 1) 화면 반영
    state.wordList = state.wordList.filter(w => w.Word !== word);
    document.dispatchEvent(new Event('wordListUpdated'));

    // 2) 서버 전송
    await sendToGAS({
        action: 'delete_word',
        word: word
    });
}

// 6. 외부 사전 API (퀴즈용 정의 가져오기)
export async function fetchDefinition(word) {
    try {
        const url = `https://dictionaryapi.com/api/v3/references/learners/json/${word}?key=${CONFIG.DICTIONARY_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        
        if (data && data.length > 0 && typeof data[0] === 'object') {
            return data[0].shortdef ? data[0].shortdef[0] : null;
        }
        return null;
    } catch (err) {
        console.error("사전 API 오류:", err);
        return null;
    }
}
