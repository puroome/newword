/**
 * 🎓 quiz.js
 * 퀴즈 모드 로직 (4지 선다, 빈칸 채우기)
 */
import { state } from './config.js';
import { shuffleArray, speak, playAudio } from './utils.js';
import { showToast } from './ui.js';

let currentQuizIndex = 0;
let score = 0;
let quizList = []; // 생성된 퀴즈 목록

// 1. 퀴즈 데이터 생성 (학습할 단어들로 문제 만들기)
export function generateQuiz() {
    if (!state.wordList || state.wordList.length < 4) {
        alert("단어가 부족합니다. 최소 4개 이상의 단어가 필요합니다.");
        return;
    }

    quizList = [];
    const pool = [...state.wordList]; // 원본 보호를 위해 복사
    shuffleArray(pool);

    // 최대 10문제 생성
    const limit = Math.min(10, pool.length);
    for (let i = 0; i < limit; i++) {
        const answer = pool[i];
        
        // 오답 보기 3개 고르기 (정답 제외)
        const distractors = pool.filter(w => w.Word !== answer.Word);
        shuffleArray(distractors);
        const options = [answer, ...distractors.slice(0, 3)];
        shuffleArray(options); // 정답 위치 섞기

        quizList.push({
            question: answer.Word, // 문제 (단어)
            answer: answer,        // 정답 객체
            options: options,      // 보기 4개
            type: 'meaning'        // 유형: 뜻 맞추기
        });
    }

    currentQuizIndex = 0;
    score = 0;
    loadQuizUI();
}

// 2. 화면에 문제 표시
function loadQuizUI() {
    const quizData = quizList[currentQuizIndex];
    const questionEl = document.getElementById('quiz-question');
    const optionsContainer = document.getElementById('quiz-options');
    const progressEl = document.getElementById('quiz-progress');
    const scoreEl = document.getElementById('quiz-score');

    // 진행 상황 표시
    progressEl.innerText = `문제 ${currentQuizIndex + 1} / ${quizList.length}`;
    scoreEl.innerText = `점수: ${score}`;

    // 문제 표시
    questionEl.innerText = quizData.question;
    speak(quizData.question); // 발음 듣기

    // 보기 버튼 생성
    optionsContainer.innerHTML = '';
    quizData.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.innerText = opt.Meaning; // 보기에 뜻 표시
        
        btn.onclick = () => checkAnswer(opt, quizData.answer, btn);
        optionsContainer.appendChild(btn);
    });
}

// 3. 정답 확인 로직
function checkAnswer(selected, correct, btnElement) {
    const buttons = document.querySelectorAll('.quiz-option');
    
    // 중복 클릭 방지
    buttons.forEach(b => b.disabled = true);

    if (selected.Word === correct.Word) {
        // 정답!
        btnElement.classList.add('correct');
        playAudio('correct'); // 딩동댕
        score += 10;
        showToast('정답입니다! 🎉');
    } else {
        // 오답...
        btnElement.classList.add('wrong');
        playAudio('wrong'); // 땡
        // 정답 버튼도 알려줌
        buttons.forEach(b => {
            if (b.innerText === correct.Meaning) b.classList.add('correct');
        });
        showToast(`틀렸습니다. 정답은 '${correct.Meaning}' 입니다.`, 'error');
    }

    // 2초 뒤 다음 문제로 이동
    setTimeout(() => {
        currentQuizIndex++;
        if (currentQuizIndex < quizList.length) {
            loadQuizUI();
        } else {
            finishQuiz();
        }
    }, 2000);
}

// 4. 퀴즈 종료 처리
function finishQuiz() {
    alert(`퀴즈 종료! \n총 점수: ${score}점`);
    // 다시 학습 모드로 돌아가거나 대시보드로 이동
    window.location.hash = 'dashboard';
}
