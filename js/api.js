// js/api.js

export const api = {
    // 단어 데이터 가져오기
    loadWordList: async function (forceUpdate = false) {
        // 이미 불러온 데이터가 있고, 강제 업데이트가 아니면 메모리에 있는 거 사용
        if (!forceUpdate && window.wordData && window.wordData.length > 0) {
            return window.wordData;
        }

        const sheetId = window.CONFIG.GOOGLE_SHEET.ID;
        // CSV 형태로 데이터 요청 (가장 빠르고 간편함)
        const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&id=${sheetId}&gid=0`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("네트워크 응답 실패");
            
            const csvText = await response.text();
            const data = this.csvToJson(csvText);
            
            // 전역 변수에 저장 (캐싱)
            window.wordData = data;
            
            // 마지막 업데이트 시간 기록
            const now = new Date();
            localStorage.setItem('lastUpdate', now.toLocaleString());
            
            console.log(`총 ${data.length}개의 단어를 불러왔습니다.`);
            return data;
        } catch (error) {
            console.error("데이터 로드 실패:", error);
            alert("단어장을 불러오는데 실패했습니다. 인터넷 연결을 확인해주세요.");
            return [];
        }
    },

    // CSV 텍스트를 JSON 객체 배열로 변환하는 헬퍼 함수
    csvToJson: function (csv) {
        const lines = csv.trim().split("\n");
        const result = [];
        // 헤더 파싱 (첫 줄)
        const headers = lines[0].split(",").map(h => h.trim().replace(/"/g, ''));

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i]) continue;
            
            // 쉼표로 분리하되, 따옴표 안의 쉼표는 무시하는 정규식
            const obj = {};
            const currentline = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];

            // 데이터 매핑
            headers.forEach((header, index) => {
                let value = currentline[index] || "";
                // 따옴표 제거
                value = value.replace(/^"|"$/g, '').trim(); 
                obj[header] = value;
            });
            
            // 필수 데이터(Word)가 있는 경우만 추가
            if (obj.Word) {
                result.push(obj);
            }
        }
        return result; // 배열 반환
    }
};

// 전역에서 접근 가능하도록 설정
window.api = api;
