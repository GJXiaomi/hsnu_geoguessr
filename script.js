// 1. 設定題目 (請替換圖片路徑與正確座標百分比)
const questions = [
    { img: '仙.jpg', x: 46.5, y: 91.7 },
    { img: '操.jpg', x: 83.5, y: 50.3 },
    { img: '體.jpg', x: 18.8, y: 76 },
    { img: '網.jpg', x: 84.7, y: 73.4 },
    { img: '演.jpg', x: 45.4, y: 17.3 }
];

let currentRound = 0;
let totalScore = 0;
let hasGuessed = false;

// DOM 元素獲取
const photoDisplay = document.getElementById('photo-display');
const statusText = document.getElementById('status');
const nextBtn = document.getElementById('next-btn');
const roundText = document.getElementById('round');
const scoreText = document.getElementById('score');
const mapContainer = document.getElementById('map-container');
const playerMarker = document.getElementById('marker');
const correctMarker = document.getElementById('correct-marker');

// 2. 初始化按鈕事件
nextBtn.addEventListener('click', () => {
    if (currentRound < 5) {
        startNewRound();
    } else {
        location.reload(); // 結束後重新開始
    }
});

// 3. 地圖點擊事件
mapContainer.addEventListener('click', (e) => {
    if (hasGuessed || currentRound === 0) return;

    const rect = mapContainer.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    showMarkers(clickX, clickY);
    calculateScore(clickX, clickY);

    console.log(clickX,clickY)
});

function startNewRound() {
    hasGuessed = false;
    playerMarker.style.display = 'none';
    correctMarker.style.display = 'none';
    
    photoDisplay.src = questions[currentRound].img;
    statusText.innerText = "這是哪裡？點擊地圖選擇位置";
    nextBtn.style.display = 'none';
    
    currentRound++;
    roundText.innerText = currentRound;
}

function showMarkers(playerX, playerY) {
    // 顯示玩家點擊位置
    playerMarker.style.left = playerX + '%';
    playerMarker.style.top = playerY + '%';
    playerMarker.style.display = 'block';

    // 顯示正確位置
    const target = questions[currentRound - 1];
    correctMarker.style.left = target.x + '%';
    correctMarker.style.top = target.y + '%';
    correctMarker.style.display = 'block';
}

function calculateScore(px, py) {
    const target = questions[currentRound - 1];
    // 歐幾里德距離公式
    const dist = Math.sqrt(Math.pow(px - target.x, 2) + Math.pow(py - target.y, 2));
    
    // 距離越小分數越高 (滿分 1000)
    const points = Math.max(0, Math.round(1000 - dist * 18));
    totalScore += points;

    scoreText.innerText = totalScore;
    statusText.innerText = `獲得 ${points} 分！`;
    
    nextBtn.style.display = 'block';
    nextBtn.innerText = currentRound === 5 ? "重新開始" : "下一題";
    hasGuessed = true;
}