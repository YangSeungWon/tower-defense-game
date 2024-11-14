import { Enemy } from './enemy';

export class Wave {
    public waveNumber: number;
    private enemiesToSpawn: number;
    private enemiesSpawned: number = 0;
    private spawnInterval: number;
    private spawnTimer: number = 0;
    private path: Array<{x: number, y: number}>;

    constructor(waveNumber: number, path: Array<{x: number, y: number}>) {
        this.waveNumber = waveNumber;
        this.enemiesToSpawn = waveNumber * 5; // 웨이브당 적의 수 증가
        this.spawnInterval = 60 / waveNumber + 30; // 웨이브당 스폰 간격 조절
        this.path = path;
    }

    public update(deltaTime: number): Enemy | null {
        this.spawnTimer++;
        if (this.enemiesSpawned < this.enemiesToSpawn && this.spawnTimer >= this.spawnInterval) {
            this.spawnTimer = 0;
            this.enemiesSpawned++;
            // 경로의 시작점에서 적 스폰
            return new Enemy(this.path[0].x, this.path[0].y, 800, this.waveNumber * 10, this.path);
        }
        return null;
    }

    public isComplete(): boolean {
        return this.enemiesSpawned >= this.enemiesToSpawn && this.spawnTimer === 0;
    }

    /**
     * Returns the number of enemies left to spawn in the current wave.
     */
    public getEnemiesToSpawn(): number {
        return this.enemiesToSpawn - this.enemiesSpawned;
    }

    /**
     * Returns the current spawn timer value.
     */
    public getSpawnTimer(): number {
        return this.spawnTimer;
    }
} 