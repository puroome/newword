// js/main.js
import { initLearning } from './learning.js';
import { initQuiz } from './quiz.js';          // 추가됨
import { initDashboard } from './dashboard.js'; // 추가됨
import { switchTab } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 App Initializing...");

    // 1. 네비게이션 버튼 연결
    const navButtons = document.querySelectorAll('#bottom-nav button');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget.dataset.target;
            
            // 탭 UI 전환
            switchTab(target);
            
            // 탭별 기능 실행
            if (target === 'learning') {
                // 학습 모드는 상태 유지를 위해 재로딩 안 함 (필요시 initLearning 호출)
            } else if (target === 'quiz') {
                initQuiz(); // 퀴즈 모드 진입 시 매번 새로 시작
            } else if (target === 'dashboard') {
                initDashboard(); // 대시보드 데이터 갱신
            }
        });
    });

    // 2. 초기 화면 로드
    initLearning();
});
