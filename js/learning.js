/**
 * 📚 learning.js
 * 학습 모드 로직 (플래시카드, 스와이프, 검색)
 */
import { state } from './config.js';
import { speak, playAudio } from './utils.js';
import { createInteractiveFragment, showToast } from './ui.js';

// DOM 요소 가져오기
const card = document.getElementById('learning-card');
const cardWord = document.getElementById('card-word');
const cardPos = document.getElementById('card-pos');
const cardMeaning = document.getElementById('card-meaning');
const cardExplanation = document.getElementById('card-explanation');
const cardSample = document.getElementById('card-sample');

let currentCardIndex = 0;
let isFlipped = false;

// 1. 카드 데이터 로드 및 표시
export function loadCard(index) {
    // 단어 목록이 없거나 인덱스가 범위를 벗어나면 종료
    if (!state.wordList || state.wordList.length === 0) {
        cardWord.innerText = "단어장이 비었습니다.";
        return;
    }
    
    // 순환 구조 (끝까지 가면 다시 처음으로)
    if (index >= state.wordList.length) index = 0;
    if (index < 0) index = state.wordList.length - 1;
    
    currentCardIndex = index;
    const wordData = state.wordList[index];

    // 앞면 채우기
    cardWord.innerText = wordData.Word;
    cardPos.innerText = wordData.POS;
    
    // 뒷면 채우기
    cardMeaning.innerText = wordData.Meaning;
    cardExplanation.innerText = wordData.Explanation;
    
    // 예문은 인터랙티브하게 변환해서 넣기
    cardSample.innerHTML = ''; // 초기화
    if (wordData.Sample) {
        cardSample.appendChild(createInteractiveFragment(wordData.Sample));
    } else {
        cardSample.innerText = "예문이 없습니다.";
    }

    // 카드 상태 초기화 (앞면 보기)
    card.classList.remove('is-flipped');
    isFlipped = false;
}

// 2. 카드 뒤집기
card.addEventListener('click', () => {
    isFlipped = !isFlipped;
    card.classList.toggle('is-flipped');
    
    if (!isFlipped) {
        // 앞면으로 돌아올 때 발음 재생
        speak(state.wordList[currentCardIndex].Word);
    }
});

// 3. 버튼 동작 (알아요 / 몰라요)
document.getElementById('btn-know').addEventListener('click', (e) => {
    e.stopPropagation(); // 카드 뒤집기 방지
    nextCard();
});

document.getElementById('btn-dont-know').addEventListener('click', (e) => {
    e.stopPropagation();
    playAudio('wrong'); // 띵~ 소리
    nextCard(); 
});

function nextCard() {
    loadCard(currentCardIndex + 1);
}

// 4. 발음 듣기 버튼 (앞면)
document.getElementById('play-audio-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    speak(state.wordList[currentCardIndex].Word);
});

// 5. 검색 기능 (실시간 필터링)
const searchInput = document.getElementById('word-search');
const suggestionsBox = document.getElementById('suggestions-container');

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    suggestionsBox.innerHTML = ''; // 기존 추천 목록 초기화
    
    if (query.length < 1) {
        suggestionsBox.classList.add('hidden');
        return;
    }

    // 검색어와 일치하는 단어 찾기
    const matches = state.wordList.filter(w => 
        w.Word.toLowerCase().includes(query) || 
        w.Meaning.includes(query)
    );

    if (matches.length > 0) {
        suggestionsBox.classList.remove('hidden');
        matches.forEach(match => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.innerText = `${match.Word} - ${match.Meaning}`;
            
            // 클릭 시 해당 카드로 바로 이동
            div.onclick = () => {
                const idx = state.wordList.indexOf(match);
                loadCard(idx);
                searchInput.value = '';
                suggestionsBox.classList.add('hidden');
            };
            suggestionsBox.appendChild(div);
        });
    } else {
        suggestionsBox.classList.add('hidden');
    }
});
