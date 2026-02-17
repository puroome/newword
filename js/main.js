import { api } from './api.js';

// --- 전역 변수 ---
let wordList = [];       // 단어장 데이터 저장
let currentWordIndex = 0; // 현재 보고 있는 단어 번호 (0부터 시작)

// --- 초기화 ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("Main App Initialized");
    setupEventListeners();
});

// --- 이벤트 리스너 설정 ---
function setupEventListeners() {
    
    // 1. [메인 화면] -> [학습 모드] 진입 버튼
    const studyBtn = document.getElementById('btn-study-mode');
    if (studyBtn) {
        studyBtn.addEventListener('click', async () => {
            // 화면 전환
            switchPage('study-page');
            
            // 데이터가 없으면 로드
            if (wordList.length === 0) {
                await loadData();
            }
            
            // 첫 단어 표시
            if (wordList.length > 0) {
                currentWordIndex = 0;
                renderCard(currentWordIndex);
            }
        });
    }

    // 2. [학습 화면] -> [메인 화면] 홈 버튼
    const homeBtn = document.querySelector('.home-btn');
    if (homeBtn) {
        homeBtn.addEventListener('click', () => {
            switchPage('main-page');
        });
    }

    // 3. 카드 뒤집기 (클릭 & 버튼)
    const flashcard = document.getElementById('flashcard');
    const flipBtn = document.getElementById('flip-btn');
    
    if (flashcard) flashcard.addEventListener('click', toggleFlip);
    if (flipBtn) flipBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // 버튼 클릭시 부모 이벤트(카드 클릭) 방지
        toggleFlip();
    });

    // 4. 다음 단어 버튼 (>)
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentWordIndex < wordList.length - 1) {
                currentWordIndex++;
                renderCard(currentWordIndex);
            } else {
                alert("마지막 단어입니다.");
            }
        });
    }

    // 5. 이전 단어 버튼 (<)
    const prevBtn = document.getElementById('prev-btn');
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentWordIndex > 0) {
                currentWordIndex--;
                renderCard(currentWordIndex);
            }
        });
    }

    // 6. 새로고침 버튼 (데이터 강제 업데이트)
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
            if(confirm("최신 데이터를 다시 불러오시겠습니까?")) {
                await loadData(true); // 강제 로드
            }
        });
    }
}

// --- 기능 함수들 ---

// 페이지 전환 함수
function switchPage(pageId) {
    // 모든 페이지 숨김
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
        page.classList.add('hidden');
    });
    
    // 선택한 페이지 표시
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.remove('hidden');
        targetPage.classList.add('active');
    }
}

// 데이터 로드 함수
async function loadData(forceUpdate = false) {
    // 로딩 표시 (선택 사항)
    document.getElementById('last-updated').textContent = "데이터 불러오는 중...";
    
    // api.js의 함수 호출
    wordList = await api.loadWordList(forceUpdate);
    
    // 업데이트 시간 표시 갱신
    const lastTime = localStorage.getItem('lastUpdate') || "알 수 없음";
    document.getElementById('last-updated').textContent = `최종 업데이트: ${lastTime}`;
}

// 카드 렌더링 (데이터 -> 화면 표시)
function renderCard(index) {
    const data = wordList[index];
    if (!data) return;

    // 카드 내용 채우기
    document.getElementById('card-word').textContent = data.Word || "No Word";
    document.getElementById('card-pos').textContent = data.POS || "";
    document.getElementById('card-meaning').textContent = data.Meaning || "";
    document.getElementById('card-explanation').textContent = data.Explanation || "";
    document.getElementById('card-example').textContent = data.Sample || "예문이 없습니다.";
    
    // AI 예문은 초기화 (새 단어니까)
    document.getElementById('card-ai-example').textContent = ""; 

    // 카드 상태 초기화 (항상 앞면부터)
    const card = document.getElementById('flashcard');
    card.classList.remove('flipped');

    // 진행률 표시바 업데이트
    const progressPercent = ((index + 1) / wordList.length) * 100;
    document.getElementById('study-progress').style.width = `${progressPercent}%`;
    document.getElementById('progress-text').textContent = `${index + 1} / ${wordList.length}`;
}

// 카드 뒤집기 토글
function toggleFlip() {
    const card = document.getElementById('flashcard');
    card.classList.toggle('flipped');
}
