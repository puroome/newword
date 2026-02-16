// js/ui.js
import { speak, stopWords } from './utils.js';

// 1. 상호작용 가능한 텍스트 생성 (핵심 기능)
// 문장을 받아 <span>단어</span>들의 집합으로 반환
export function createInteractiveFragment(text) {
    const fragment = document.createDocumentFragment();
    if (!text) return fragment;

    // 공백으로 단어 분리
    const words = text.split(' ');

    words.forEach((wordText, index) => {
        const span = document.createElement('span');
        span.textContent = wordText;
        span.className = 'interactive-word';
        
        // 정제된 단어 (특수문자 제거)
        const cleanWord = wordText.replace(/[.,?!()]/g, '').toLowerCase();

        // 불용어가 아니면 이벤트 추가
        if (!stopWords.has(cleanWord)) {
            // 클릭 시 TTS 재생
            span.addEventListener('click', (e) => {
                e.stopPropagation(); // 부모 요소(카드) 클릭 방지
                speak(wordText);
                // 여기에 나중에 툴팁이나 메뉴 로직 추가 가능
            });
            
            // 롱프레스 (Context Menu) 로직은 모바일에서 복잡하므로 
            // learning.js에서 통합 관리하거나 여기서 추가 구현
        }

        fragment.appendChild(span);
        // 단어 사이 공백 추가
        if (index < words.length - 1) {
            fragment.appendChild(document.createTextNode(' '));
        }
    });

    return fragment;
}

// 2. 토스트 메시지 (화면 중앙 하단 알림)
export function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // 2초 후 사라짐
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 2000);
}

// 3. 탭 전환 (학습/퀴즈/대시보드)
export function switchTab(tabId) {
    // 모든 섹션 숨김
    document.querySelectorAll('section').forEach(el => el.classList.remove('active', 'hidden'));
    document.querySelectorAll('section').forEach(el => el.classList.add('hidden'));
    
    // 선택한 섹션 보이기
    const target = document.getElementById(`section-${tabId}`);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('active');
    }

    // 네비게이션 버튼 활성화 표시
    document.querySelectorAll('#bottom-nav button').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`#bottom-nav button[data-target="${tabId}"]`);
    if (activeBtn) activeBtn.classList.add('active');
}
