import { initLearning } from './learning.js';
import { switchTab } from './ui.js';

// 앱 시작점
document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 App Initializing...");

    // 1. 네비게이션 버튼 연결
    const navButtons = document.querySelectorAll('#bottom-nav button');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // data-target 속성 값 가져오기 (learning, quiz, dashboard)
            const target = e.currentTarget.dataset.target;
            
            // 탭 전환 UI
            switchTab(target);
            
            // 탭별 로직 실행
            if (target === 'learning') {
                // 필요하면 여기서 다시 로드하거나 상태 유지
            } else if (target === 'quiz') {
                alert("퀴즈 모드는 다음 업데이트에 추가됩니다!");
                // initQuiz();
            } else if (target === 'dashboard') {
                alert("통계는 데이터를 더 쌓고 오세요!");
                // initDashboard();
            }
        });
    });

    // 2. 초기 화면 로드 (학습 모드)
    initLearning();
});
