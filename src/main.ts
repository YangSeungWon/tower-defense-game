import { Game } from './game';

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const context = canvas.getContext('2d');

if (!context) {
    throw new Error('Canvas를 지원하지 않습니다.');
}

const game = new Game(context);

const MAX_FPS = 60;
const INTERVAL = 1000 / MAX_FPS;
let lastTime = performance.now();
let accumulator = 0;


function gameLoop(currentTime: number) {
    const deltaTime = (currentTime - lastTime) / 1000; // 초 단위
    lastTime = currentTime;
    accumulator += deltaTime;

    while (accumulator >= INTERVAL) {
        game.update(INTERVAL / 1000);
        accumulator -= INTERVAL;
    }

    game.render();

    if (!game.getIsGameOver()) {
        requestAnimationFrame(gameLoop);
    } else {
        alert('게임 오버!');
        // 필요 시 페이지 새로고침 또는 초기화 로직 추가
    }
}

requestAnimationFrame(gameLoop); 