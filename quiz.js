import { fetchAllWords } from './api.js';
import { shuffleArray, speak } from './utils.js';

let words = [];
let currentQuestion = null;
let score = 0;

// DOM 요소
const els = {
    questionText: document.getElementById('quiz-question-text'),
    optionsContainer: document.getElementById('quiz-options'),
    feedback: document.getElementById('quiz-feedback'),
    nextBtn: document.getElementById('btn-next-quiz'),
    score: document.getElementById('quiz-score')
};

export async function initQuiz() {
    console.log("퀴즈 모드 시작...");
    
    // 데이터 로드
    const data = await fetchAllWords();
    if (data.length < 4) {
        els.questionText.textContent = "단어가 최소 4개 필요합니다.";
        return;
    }
    
    words = data;
    score = 0;
    updateScore();
    generateQuestion();
    
    // 다음 버튼 이벤트
    els.nextBtn.onclick = generateQuestion;
}

function generateQuestion() {
    // UI 초기화
    els.feedback.classList.add('hidden');
    els.nextBtn.classList.add('hidden');
    els.optionsContainer.innerHTML = '';
    
    // 1. 정답 단어 랜덤 선택
    const answerIndex = Math.floor(Math.random() * words.length);
    const answer = words[answerIndex];
    currentQuestion = answer;

    // 2. 오답 단어 3개 랜덤 선택 (정답 제외)
    let options = [answer];
    while (options.length < 4) {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        if (!options.includes(randomWord)) {
            options.push(randomWord);
        }
    }

    // 3. 보기 섞기
    options = shuffleArray(options);

    // 4. 화면 표시 (영어 단어를 보여주고 한글 뜻 맞추기)
    els.questionText.textContent = answer.word;
    speak(answer.word); // 문제 읽어주기

    // 5. 보기 버튼 생성
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'quiz-btn';
        btn.textContent = opt.meaning; // 보기는 뜻으로 표시
        btn.onclick = () => checkAnswer(opt, btn);
        els.optionsContainer.appendChild(btn);
    });
}

function checkAnswer(selectedOption, btnElement) {
    // 이미 풀었으면 무시 (중복 클릭 방지)
    if (!els.nextBtn.classList.contains('hidden')) return;

    const isCorrect = selectedOption.word === currentQuestion.word;

    if (isCorrect) {
        // 정답 처리
        btnElement.classList.add('correct');
        els.feedback.textContent = "Excellent! 🎉";
        els.feedback.style.background = "#28a745"; // 초록색
        score += 10;
        speak("Correct!");
    } else {
        // 오답 처리
        btnElement.classList.add('wrong');
        els.feedback.textContent = `땡! 정답은: ${currentQuestion.meaning}`;
        els.feedback.style.background = "#dc3545"; // 빨간색
        
        // 정답 버튼 찾아서 표시해주기 (친절한 UI)
        const buttons = els.optionsContainer.querySelectorAll('button');
        buttons.forEach(b => {
            if (b.textContent === currentQuestion.meaning) {
                b.classList.add('correct');
            }
        });
        speak("Try again");
    }

    // 결과 보여주기
    els.feedback.classList.remove('hidden');
    els.nextBtn.classList.remove('hidden');
    updateScore();
}

function updateScore() {
    els.score.textContent = `Score: ${score}`;
}
