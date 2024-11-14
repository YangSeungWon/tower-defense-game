import { Tower } from './tower';
import { Enemy } from './enemy';
import { Wave } from './wave';
import { UI } from './ui';

export class Game {
    private context: CanvasRenderingContext2D;
    private towers: Tower[] = [];
    private enemies: Enemy[] = [];
    private spawnTimer: number = 0;
    private currentWave: Wave;
    private waveNumber: number = 1;
    private score: number = 0;
    private lives: number = 20;
    private isGameOver: boolean = false;
    private ui: UI;

    // Path 정의: 적들이 따라갈 웨이포인트들
    private path: Array<{x: number, y: number}> = [
        {x: 100, y: 300},
        {x: 300, y: 300},
        {x: 300, y: 200},
        {x: 500, y: 200},
        {x: 500, y: 400},
        {x: 700, y: 400}
    ];

    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
        this.currentWave = new Wave(this.waveNumber, this.path);
        this.ui = new UI(this, context);

        // 기본 타워 하나 추가 (예: 좌표 (150, 350))
        this.addTower(150, 350);

        // 유저 인터랙션을 위한 클릭 이벤트 추가
        this.context.canvas.addEventListener('click', (e) => this.handleClick(e));
    }

    public update(deltaTime: number): void {
        if (this.isGameOver) return;

        // 적 업데이트
        this.enemies.forEach(enemy => enemy.update(deltaTime));

        // 타워 업데이트
        this.towers.forEach(tower => tower.update(deltaTime, this.enemies));

        // 웨이브 업데이트
        const newEnemy = this.currentWave.update(deltaTime);
        if (newEnemy) {
            this.enemies.push(newEnemy);
        }

        // 적 제거 및 생명 감소
        this.enemies = this.enemies.filter(enemy => {
            if (enemy.isDead()) {
                this.score += 10;
                return false;
            } else if (enemy.hasReachedEnd()) {
                this.lives--;
                if (this.lives <= 0) {
                    this.isGameOver = true;
                }
                return false;
            }
            return true;
        });

        // UI 업데이트
        this.ui.update();

        // 게임 오버 조건 확인
        if (this.isGameOver) {
            alert('게임 오버!');
            // 페이지 새로고침 또는 초기화 로직 추가 가능
        }
    }

    public render(): void {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

        // 경로 렌더링
        this.renderPath();

        // 적 렌더링
        this.enemies.forEach(enemy => enemy.render(this.context));

        // 타워 렌더링
        this.towers.forEach(tower => tower.render(this.context));

        // UI 렌더링
        this.renderUI();
        this.ui.render();
    }

    private renderPath(): void {
        if (this.path.length < 2) return;

        this.context.strokeStyle = 'yellow';
        this.context.lineWidth = 10;
        this.context.beginPath();
        this.context.moveTo(this.path[0].x, this.path[0].y);
        this.path.forEach(point => this.context.lineTo(point.x, point.y));
        this.context.stroke();
    }

    private spawnEnemy(): void {
        // 이 함수는 이제 Wave 클래스에서 적을 스폰하도록 변경되었습니다.
    }

    private addTower(x: number, y: number): void {
        const tower = new Tower(x, y);
        this.towers.push(tower);
    }

    public getTowers(): Tower[] {
        return this.towers;
    }

    public upgradeTower(tower: Tower): void {
        // 점수에서 업그레이드 비용을 차감하는 로직 추가 필요
        if (this.score >= tower.getUpgradeCost()) {
            this.score -= tower.getUpgradeCost();
            tower.upgrade();
        } else {
            alert('업그레이드에 필요한 점수가 부족합니다.');
        }
    }

    private handleClick(event: MouseEvent): void {
        const rect = this.context.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        this.addTower(x, y);
    }

    private renderUI(): void {
        this.context.fillStyle = 'white';
        this.context.font = '20px Arial';
        this.context.fillText(`Wave: ${this.waveNumber}`, 10, 20);
        this.context.fillText(`Score: ${this.score}`, 10, 50);
        this.context.fillText(`Lives: ${this.lives}`, 10, 80);
    }

    /**
     * Returns the current wave number.
     */
    public getWaveNumber(): number {
        return this.waveNumber;
    }

    /**
     * Returns the current score.
     */
    public getScore(): number {
        return this.score;
    }

    /**
     * Returns the remaining lives.
     */
    public getLives(): number {
        return this.lives;
    }

    /**
     * Returns the list of active enemies.
     */
    public getEnemies(): Enemy[] {
        return this.enemies;
    }

    /**
     * Returns the current wave instance.
     */
    public getCurrentWave(): Wave {
        return this.currentWave;
    }

    public getIsGameOver(): boolean {
        return this.isGameOver;
    }
} 