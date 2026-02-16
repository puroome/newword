import { fetchAllWords, deleteWord } from './api.js';
import { createInteractiveFragment, showToast } from './ui.js';
import { speak, shuffleArray } from './utils.js';

// 상태 관리
let words = [];
let currentIndex = 0;
let isFlipped = false;

// DOM 요소
const card = document.getElementById('learning-card');
const els = {
    word: document.getElementById('card-word'),
    pos: document.getElementById('card-pos'),
    meaning: document.getElementById('card-meaning'),
    explanation: document.getElementById('card-explanation'),
    sample: document.getElementById('card-sample'),
    progress: document.getElementById('progress-text')
};

// 1. 초기화 및 데이터 로드
export async function initLearning() {
    console.log("학습 모드 시작...");
    
    // 로딩 표시
    els.word.textContent = "Loading...";
    
    // API에서 단어 가져오기
    const data = await fetchAllWords();
    
    if (data.length === 0) {
        els.word.textContent = "No Data";
        return;
    }

    // 셔플 후 저장
    words = shuffleArray(data);
    currentIndex = 0;
    
    renderCard();
    setupEventListeners();
}

// 2. 카드 렌더링 (화면에 표시)
function renderCard() {
    if (currentIndex >= words.length) {
        alert("학습 완료! 다시 섞습니다.");
        currentIndex = 0;
        words = shuffleArray(words);
    }

    const item = words[currentIndex];
    
    // 텍스트 주입
    els.word.textContent = item.word;
    els.pos.textContent = item.pos || 'noun';
    els.meaning.textContent = item.meaning;
    els.explanation.textContent = item.explanation || '';
    
    // 예문: 상호작용(클릭) 가능하도록 변환
    els.sample.innerHTML = ''; // 초기화
    if (item.sample) {
        els.sample.appendChild(createInteractiveFragment(item.sample));
    } else {
        els.sample.textContent = "예문이 없습니다.";
    }

    // 카드 상태 초기화 (앞면 보기)
    card.classList.remove('is-flipped');
    isFlipped = false;

    // 진행률 업데이트
    els.progress.textContent = `${currentIndex + 1} / ${words.length}`;
}

// 3. 이벤트 리스너 설정
function setupEventListeners() {
    // 카드 뒤집기 (단, 스피커 버튼 클릭이나 텍스트 선택 제외)
    card.addEventListener('click', (e) => {
        // 예문 단어 클릭이나 스피커 버튼은 뒤집기 방지
        if (e.target.closest('.interactive-word') || e.target.closest('.btn-sound')) return;
        
        isFlipped = !isFlipped;
        card.classList.toggle('is-flipped');
        
        // 뒤집을 때 뒷면 예문 읽어주기 (선택 사항)
        if (isFlipped && words[currentIndex].sample) {
            // speak(words[currentIndex].sample); 
        }
    });

    // 앞면 스피커 버튼
    document.getElementById('btn-speak-front').addEventListener('click', (e) => {
        e.stopPropagation();
        speak(words[currentIndex].word);
    });

    // 알고 모름 버튼
    document.getElementById('btn-known').addEventListener('click', nextCard);
    document.getElementById('btn-unknown').addEventListener('click', nextCard);

    // 롱프레스 이벤트 (단어 수정/삭제 메뉴)
    setupLongPress();
}

// 다음 카드로 이동
function nextCard() {
    currentIndex++;
    renderCard();
}

// 4. 롱프레스 구현 (수정/삭제 기능 진입점)
function setupLongPress() {
    let timer;
    const wordEl = els.word;

    // 터치 시작
    wordEl.addEventListener('touchstart', () => {
        timer = setTimeout(() => showActionSheet(), 800); // 0.8초 꾹 누르면
    });
    
    wordEl.addEventListener('touchend', () => clearTimeout(timer));
    wordEl.addEventListener('touchmove', () => clearTimeout(timer));
    
    // 마우스 (PC용)
    wordEl.addEventListener('mousedown', () => {
        timer = setTimeout(() => showActionSheet(), 800);
    });
    wordEl.addEventListener('mouseup', () => clearTimeout(timer));
}

// 간단한 액션 시트 (prompt 사용) - 추후 UI 개선 가능
function showActionSheet() {
    const currentWord = words[currentIndex];
    const choice = confirm(`[관리 메뉴]\n단어: ${currentWord.word}\n\n이 단어를 삭제하시겠습니까? (취소 시 아무 일도 안 함)`);
    
    if (choice) {
        // 삭제 로직
        deleteWord(currentWord.word).then(res => {
            showToast("삭제 요청됨. 잠시 후 반영됩니다.");
            // UI에서 즉시 제거 (낙관적 업데이트)
            words.splice(currentIndex, 1);
            renderCard();
        });
    }
}
