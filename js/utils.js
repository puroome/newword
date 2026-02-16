// js/utils.js
import { state } from './config.js';

// 1. 배열 섞기 (Fisher-Yates Shuffle)
export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 2. TTS (텍스트 음성 변환)
export function speak(text, lang = 'en-US') {
    if (!text) return;
    
    // 이미 말하고 있다면 취소
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    // 설정에서 목소리 가져오기 (US/UK)
    const preferredLang = state.userSettings.voiceType === 'UK' ? 'en-GB' : 'en-US';
    utterance.lang = preferredLang;
    utterance.rate = 0.9; // 약간 천천히

    window.speechSynthesis.speak(utterance);
}

// 3. 디바운스 (연속 호출 방지)
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 4. 불용어 (클릭 방지용)
export const stopWords = new Set(['a', 'an', 'the', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'to', 'for', 'of']);
