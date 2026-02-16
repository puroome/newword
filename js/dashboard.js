/**
 * 📊 dashboard.js
 * 학습 통계 및 차트 시각화
 */
import { state } from './config.js';

let chartInstance = null;

// 통계 화면 업데이트
export function updateDashboard() {
    const totalWords = state.wordList.length;
    // 임시 통계 데이터 (나중에는 localStorage에서 실제 기록을 불러와야 함)
    const studyTime = Math.floor(Math.random() * 60) + 10; // 가짜 데이터 (10~70분)

    document.getElementById('stat-total-words').innerText = `${totalWords}개`;
    document.getElementById('stat-study-time').innerText = `${studyTime}분`;

    renderChart();
}

// 차트 그리기 (Chart.js)
function renderChart() {
    const ctx = document.getElementById('learningChart').getContext('2d');

    // 기존 차트가 있으면 삭제 (안 그러면 겹쳐서 나옴)
    if (chartInstance) {
        chartInstance.destroy();
    }

    // 예시 데이터: 최근 7일간 학습량
    const labels = ['월', '화', '수', '목', '금', '토', '일'];
    const data = [10, 25, 15, 30, 20, 45, state.wordList.length]; 

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '학습한 단어 수',
                data: data,
                borderColor: '#4a90e2',
                backgroundColor: 'rgba(74, 144, 226, 0.2)',
                borderWidth: 2,
                fill: true,
                tension: 0.4 // 곡선 부드럽게
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false } // 범례 숨김
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}
