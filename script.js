// 1. 設定題目 (請替換圖片路徑與正確座標百分比)
let questions = [
    { img: '仙.jpg', x: 47, y: 95 },
    { img: '操.jpg', x: 84, y: 49 },
    { img: '體.jpg', x: 17, y: 76.5 },
    { img: '網.jpg', x: 87.5, y: 74 },
    { img: '演.jpg', x: 45.4, y: 17.3 }
];

let questionpool = []; // 用來存放洗牌後的 5 題
let currentRound = 0;
let totalScore = 0;
let hasGuessed = false;
const SAFE_ZONE = 10;

// DOM 元素獲取
const photoDisplay = document.getElementById('photo-display');
const statusText = document.getElementById('status');
const nextBtn = document.getElementById('next-btn');
const roundText = document.getElementById('round');
const scoreText = document.getElementById('score');
const mapContainer = document.getElementById('map-container');
const playerMarker = document.getElementById('marker');
const correctMarker = document.getElementById('correct-marker');

// --- 新增：洗牌演算法 (Fisher-Yates Shuffle) ---
function shuffleQuestions() {
    // 複製一份題庫，以免影響原始資料
    let shuffled = [...questions]; 
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    // 取出前 5 題作為本次遊戲題目
    return shuffled.slice(0, 5);
}

// 2. 初始化按鈕事件
nextBtn.addEventListener('click', () => {
    if (currentRound === 0) {
        // 第一回合開始前，先洗牌
        questions = shuffleQuestions();
        startNewRound();
    } else if (currentRound < 5) {
        startNewRound();
    } else {
        location.reload(); 
    }
});

// 3. 地圖點擊事件
mapContainer.addEventListener('click', (e) => {
  if (hasGuessed || currentRound === 0) return;
  const rect = mapContainer.getBoundingClientRect();
  const scaleX = mapContainer.offsetWidth / rect.width;
  const scaleY = mapContainer.offsetHeight / rect.height;
  const clickX = (e.offsetX / mapContainer.clientWidth) * 100;
const clickY = (e.offsetY / mapContainer.clientHeight) * 100;
  // ( 或可以用 offsetX/offsetY，但只在沒有其他padding/transform時最好 )
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
    
    // 1. 計算歐幾里德距離 (d = sqrt(Δx² + Δy²))
    // 這個數值代表在平面圖上的百分比距離
    const dist = Math.sqrt(Math.pow((px - target.x)/100*235, 2) + Math.pow((py - target.y)/100*457, 2));
    
    let points = 0;

    // 2. 判斷是否在「免罰分」範圍內
    if (dist <= SAFE_ZONE) {
        points = 0; // 完美命中，不增加誤差分數
    } else {
        // 扣除掉免罰範圍後，剩下的距離即為分數 (保留一位小數)
        points = parseFloat((dist).toFixed(1));
    }

    // 3. 累加總分（總誤差）
    totalScore = parseFloat((totalScore + points).toFixed(1));

    // 4. 更新 UI
    scoreText.innerText = totalScore;
    
    if (points === 0) {
        statusText.innerText = `太神了！完全命中`;
    } else {
        statusText.innerText = `誤差距離：${points} 公尺`;
    }
    
    nextBtn.style.display = 'block';
    nextBtn.innerText = currentRound === 5 ? "重新開始" : "下一題";
    hasGuessed = true;
}

