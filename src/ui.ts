import { Tower } from './tower';
import { Game } from './game';

export class UI {
    private game: Game;
    private selectedTower: Tower | null = null;
    private context: CanvasRenderingContext2D;

    constructor(game: Game, context: CanvasRenderingContext2D) {
        this.game = game;
        this.context = context;

        // 타워 선택을 위한 클릭 이벤트 추가
        this.context.canvas.addEventListener('contextmenu', (e) => this.handleRightClick(e));
    }

    public update(): void {
        // Add any UI update logic here if needed
    }

    public render(): void {
        if (this.selectedTower) {
            // 업그레이드 버튼 그리기
            this.context.fillStyle = 'gray';
            this.context.fillRect(10, 100, 100, 40);
            this.context.fillStyle = 'white';
            this.context.font = '16px Arial';
            this.context.fillText(`Upgrade (${this.selectedTower.getUpgradeCost()})`, 15, 125);
        }

        // === Debug Information Rendering ===
        this.context.fillStyle = 'white';
        this.context.font = '14px Arial';

        // Positioning the debug information below the upgrade button
        let debugY = 160;

        // Display Wave Number
        this.context.fillText(`Wave: ${this.game.getWaveNumber()}`, 10, debugY);
        debugY += 20;

        // Display Score
        this.context.fillText(`Score: ${this.game.getScore()}`, 10, debugY);
        debugY += 20;

        // Display Lives
        this.context.fillText(`Lives: ${this.game.getLives()}`, 10, debugY);
        debugY += 20;

        // Display Number of Towers
        this.context.fillText(`Towers: ${this.game.getTowers().length}`, 10, debugY);
        debugY += 20;

        // Display Number of Enemies
        this.context.fillText(`Enemies: ${this.game.getEnemies().length}`, 10, debugY);
        debugY += 20;

        // Optionally, display additional debug info like current wave details
        const currentWave = this.game.getCurrentWave();
        this.context.fillText(`Enemies to Spawn: ${currentWave.getEnemiesToSpawn()}`, 10, debugY);
        debugY += 20;
        this.context.fillText(`Spawn Timer: ${currentWave.getSpawnTimer()}`, 10, debugY);
        // === End of Debug Information ===
    }

    private handleRightClick(event: MouseEvent): void {
        event.preventDefault();
        const rect = this.context.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // 타워 선택 로직 (간단히 클릭한 위치에 가까운 타워 선택)
        const towers = this.game.getTowers();
        let nearestTower: Tower | null = null;
        let minDist = 30;

        towers.forEach(tower => {
            const dist = Math.hypot(tower.getX() - x, tower.getY() - y);
            if (dist < minDist) {
                minDist = dist;
                nearestTower = tower;
            }
        });

        if (nearestTower) {
            this.selectedTower = nearestTower;
        } else {
            this.selectedTower = null;
        }

        // 업그레이드 버튼 클릭 시 업그레이드
        if (this.selectedTower && x >= 10 && x <= 110 && y >= 100 && y <= 140) {
            this.game.upgradeTower(this.selectedTower);
        }
    }
} 