import { Enemy } from './enemy';
import { Projectile } from './projectile';

export class Tower {
    private x: number;
    private y: number;
    private range: number = 100;
    private cooldown: number = 0;
    private cooldownTime: number = 60; // 프레임 단위
    private projectiles: Projectile[] = [];
    private level: number = 1;
    private damage: number = 25;
    private upgradeCost: number = 50;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public update(deltaTime: number, enemies: Enemy[]): void {
        if (this.cooldown > 0) {
            this.cooldown--;
        } else {
            const target = this.findNearestEnemy(enemies);
            if (target) {
                this.shoot(target);
                this.cooldown = this.cooldownTime;
            }
        }

        // 업데이트된 프로젝타일들
        this.projectiles = this.projectiles.filter(p => p.isActive());
        this.projectiles.forEach(p => p.update());
    }

    public render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 20 + (this.level - 1) * 5, 0, Math.PI * 2);
        ctx.fill();

        // 프로젝타일 렌더링
        this.projectiles.forEach(p => p.render(ctx));

        // 타워 레벨 표시
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.fillText(`Lv.${this.level}`, this.x - 10, this.y + 5);
    }

    private findNearestEnemy(enemies: Enemy[]): Enemy | null {
        let nearest: Enemy | null = null;
        let minDist: number = this.range;

        enemies.forEach(enemy => {
            const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
            if (dist < minDist) {
                minDist = dist;
                nearest = enemy;
            }
        });

        return nearest;
    }

    public shoot(enemy: Enemy): void {
        const projectile = new Projectile(this.x, this.y, enemy, this.damage);
        this.projectiles.push(projectile);
    }

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

    public getUpgradeCost(): number {
        return this.upgradeCost;
    }

    public upgrade(): void {
        this.level++;
        this.range += 20;
        this.damage += 15;
        this.upgradeCost += 50;
    }
} 