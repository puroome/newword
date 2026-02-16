/**
 * 🚀 main.js
 * 앱 진입점 (Entry Point), 라우팅, 초기화 담당
 */
import { loadWordList } from './api.js';
import { loadCard } from './learning.js';
import { generateQuiz } from './quiz.js';
import { updateDashboard } from './dashboard.js';
import { toggleLoading, showToast } from './ui.js';
import { state } from './config.js';

// 1. 앱 초기화 (시작하자마자 실행됨)
async function initApp() {
    toggleLoading(true); // 로딩 화면 켜기
    
    try {
        // Firebase에서 단어장 불러오기
        await loadWordList();
        
        // 데이터가 잘 왔는지 확인
        if (state.wordList.length > 0) {
            showToast(`${state.wordList.length}개의 단어를 불러왔습니다.`);
            loadCard(0); // 첫 번째 카드 띄우기
        } else {
            showToast('단어장이 비어있습니다. 단어를 추가해주세요.', 'error');
        }
    } catch (err) {
        console.error(err);
        showToast('데이터 로딩 실패!', 'error');
    } finally {
        toggleLoading(false); // 로딩 화면 끄기
    }

    // 초기 화면 라우팅
    handleRoute();
}

// 2. 라우팅 (화면 전환) 처리
// URL 뒤에 #learning, #quiz 등이 바뀔 때마다 실행됨
function handleRoute() {
    const hash = window.location.hash || '#learning'; // 기본값은 학습 모드
    
    // 모든 섹션 숨기기
    document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
    
    // 네비게이션 버튼 활성화 상태 초기화
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    // 현재 해시에 맞는 섹션만 보여주기
    if (hash === '#learning') {
        document.getElementById('learning-section').classList.remove('hidden');
        document.querySelector('button[onclick*="learning"]').classList.add('active');
    } else if (hash === '#quiz') {
        document.getElementById('quiz-section').classList.remove('hidden');
        document.querySelector('button[onclick*="quiz"]').classList.add('active');
        generateQuiz(); // 퀴즈 모드 진입 시 문제 생성
    } else if (hash === '#dashboard') {
        document.getElementById('dashboard-section').classList.remove('hidden');
        document.querySelector('button[onclick*="dashboard"]').classList.add('active');
        updateDashboard(); // 통계 업데이트
    }
}

// 3. 이벤트 리스너 등록
window.addEventListener('hashchange', handleRoute); // 뒤로가기/메뉴이동 감지
window.addEventListener('DOMContentLoaded', initApp); // 로딩 완료 시 앱 시작

// 발음(영국/미국) 토글 버튼
document.getElementById('voice-toggle-btn').addEventListener('click', (e) => {
    // 상태 변경
    state.voiceType = state.voiceType === 'UK' ? 'US' : 'UK';
    
    // 버튼 텍스트 변경
    e.target.innerText = state.voiceType === 'UK' ? '🇬🇧' : '🇺🇸';
    
    showToast(`발음이 ${state.voiceType === 'UK' ? '영국식' : '미국식'}으로 설정되었습니다.`);
});
