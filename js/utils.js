/**
 * 🛠️ utils.js
 * 앱 전반에서 사용되는 유틸리티 함수 모음
 */
import { state } from './config.js';

// 1. 텍스트 음성 변환 (TTS)
export function speak(text, lang = 'en-US') {
    if (!text) return;
    
    // 설정된 목소리 타입(UK/US) 적용
    const voiceLang = state.voiceType === 'UK' ? 'en-GB' : 'en-US';
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceLang;
    utterance.rate = 0.9; // 약간 천천히

    // 브라우저에서 사용 가능한 목소리 찾기
    const voices = window.speechSynthesis.getVoices();
    const specificVoice = voices.find(v => v.lang.includes(voiceLang));
    if (specificVoice) utterance.voice = specificVoice;

    window.speechSynthesis.cancel(); // 이전 소리 끄기
    window.speechSynthesis.speak(utterance);
}

// 2. 효과음 재생
export function playAudio(type) {
    // 효과음 파일 경로 (필요시 실제 mp3 경로로 교체)
    // 현재는 브라우저 기본 비프음 등을 대신하거나, 나중에 파일 추가
    // console.log(`🎵 Sound Effect: ${type}`);
}

// 3. 배열 섞기 (Fisher-Yates Shuffle) - 퀴즈 보기에 사용
export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 4. 레벤슈타인 거리 (Levenshtein Distance) - 오타/유사도 검사
export function levenshteinDistance(s, t, limit = 5) {
    if (s === t) return 0;
    if (Math.abs(s.length - t.length) > limit) return limit + 1; // 최적화: 길이 차이가 너무 크면 포기

    const d = []; 
    const n = s.length;
    const m = t.length;

    for (let i = 0; i <= n; i++) d[i] = [i];
    for (let j = 0; j <= m; j++) d[0][j] = j;

    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            const cost = s[i - 1] === t[j - 1] ? 0 : 1;
            d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
        }
    }
    return d[n][m];
}

// 5. 디바운스 (Debounce) - 검색어 입력 시, 마우스 오버 시 과도한 실행 방지
export function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// 6. 로컬 스토리지 관리
export const storage = {
    save: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
    load: (key) => {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
};

// 7. 불용어(Stopwords) 체크 - 예문 클릭 시 무시할 단어들
const stopWords = new Set(['a', 'an', 'the', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'to', 'for', 'of', 'with']);
export function isInteractiveWord(word) {
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
    return cleanWord.length > 1 && !stopWords.has(cleanWord);
}
