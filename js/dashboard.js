import { fetchAllWords } from './api.js';

let chartInstance = null;

export async function initDashboard() {
    console.log("대시보드 로딩 중...");
    
    const words = await fetchAllWords();
    const totalCount = words.length;
    
    // 통계 계산 (임시 로직: 단어 길이에 따라 난이도 분류 예시)
    // 실제로는 학습 횟수 데이터를 GAS에서 가져와야 정확함
    let nouns = 0, verbs = 0, others = 0;
    
    words.forEach(w => {
        const pos = (w.pos || '').toLowerCase();
        if (pos.includes('noun') || pos.includes('명사')) nouns++;
        else if (pos.includes('verb') || pos.includes('동사')) verbs++;
        else others++;
    });

    // 화면 업데이트
    document.getElementById('stat-total').textContent = totalCount;
    // 임의의 학습률 표시 (실제 데이터 연동 전까지 데모용)
    document.getElementById('stat-learned').textContent = Math.round(Math.random() * 30 + 10) + "%";

    renderChart(nouns, verbs, others);
}

function renderChart(nouns, verbs, others) {
    const ctx = document.getElementById('learningChart').getContext('2d');
    
    // 기존 차트가 있으면 삭제 (중복 생성 방지)
    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'doughnut', // 도넛 차트
        data: {
            labels: ['Nouns (명사)', 'Verbs (동사)', 'Others (기타)'],
            datasets: [{
                data: [nouns, verbs, others],
                backgroundColor: ['#4A90E2', '#50E3C2', '#F5A623'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' },
                title: { display: true, text: 'Word Composition (품사 분포)' }
            }
        }
    });
}
