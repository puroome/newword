/**
 * 🎨 ui.js
 * UI 컴포넌트 제어 (토스트 메시지, 모달, 컨텍스트 메뉴)
 */
import { speak, isInteractiveWord } from './utils.js';
import { state } from './config.js';
import { deleteWord, updateWord, createWord } from './api.js';

// 1. 토스트 메시지 (화면 하단에 잠시 떴다 사라지는 알림)
export function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerText = message;
    
    // 스타일 추가 (CSS에 toast 클래스가 있다고 가정)
    toast.style.background = type === 'error' ? '#e74c3c' : '#333';
    toast.style.color = '#fff';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '5px';
    toast.style.marginTop = '10px';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';

    container.appendChild(toast);
    
    // 애니메이션: 등장 -> 대기 -> 사라짐
    setTimeout(() => { toast.style.opacity = '1'; }, 10);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 2. 로딩 스피너 제어
export function toggleLoading(show) {
    const spinner = document.getElementById('loading-spinner');
    if (show) spinner.classList.remove('hidden');
    else spinner.classList.add('hidden');
}

// 3. 인터랙티브 문장 만들기 (핵심 기능!)
// 예문(String)을 받아서, 단어 하나하나가 클릭 가능한 <span> 태그로 쪼개진 HTML(Fragment)로 반환
export function createInteractiveFragment(sentence) {
    const fragment = document.createDocumentFragment();
    const words = sentence.split(' ');

    words.forEach(wordText => {
        const span = document.createElement('span');
        span.textContent = wordText + ' '; // 뒤에 공백 추가
        
        // 불용어(a, the 등)가 아니면 클릭 이벤트 추가
        if (isInteractiveWord(wordText)) {
            span.className = 'interactive-word';
            
            // 클릭 시 발음 듣기 & 메뉴 열기
            span.addEventListener('click', (e) => {
                e.stopPropagation(); // 부모 요소 클릭 방지
                speak(wordText);     // 1. 읽어주기
                showContextMenu(e, wordText.replace(/[^a-zA-Z]/g, '')); // 2. 메뉴 열기 (특수문자 제거)
            });
        }
        fragment.appendChild(span);
    });

    return fragment;
}

// 4. 컨텍스트 메뉴 (단어 클릭 시 나오는 수정/삭제 메뉴)
const contextMenu = document.getElementById('context-menu');

function showContextMenu(e, word) {
    e.preventDefault();
    
    // 메뉴 위치 잡기 (마우스/터치 위치 근처)
    contextMenu.style.left = `${e.pageX}px`;
    contextMenu.style.top = `${e.pageY}px`;
    contextMenu.classList.remove('hidden');

    // 메뉴 버튼 기능 연결
    document.getElementById('menu-tts').onclick = () => speak(word);
    
    // 수정 기능
    document.getElementById('menu-edit').onclick = () => {
        const newMeaning = prompt(`${word}의 뜻을 수정하세요:`);
        if (newMeaning) {
            updateWord(word, { Meaning: newMeaning });
            showToast('수정되었습니다.');
        }
        hideContextMenu();
    };

    // 삭제 기능
    document.getElementById('menu-delete').onclick = () => {
        if (confirm(`'${word}' 단어를 삭제할까요?`)) {
            deleteWord(word);
            showToast('삭제되었습니다.', 'error');
        }
        hideContextMenu();
    };
}

// 메뉴 닫기 (아무 곳이나 클릭하면 닫힘)
function hideContextMenu() {
    contextMenu.classList.add('hidden');
}

document.addEventListener('click', hideContextMenu);
