import { Enemy } from './enemy';

export class Projectile {
    private x: number;
    private y: number;
    private target: Enemy;
    private speed: number = 5;
    private damage: number;
    private active: boolean = true;

    constructor(x: number, y: number, target: Enemy, damage: number = 25) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.damage = damage;
    }

    public update(): void {
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const distance = Math.hypot(dx, dy);

        if (distance < this.speed) {
            this.hitTarget();
        } else {
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        }
    }

    public render(ctx: CanvasRenderingContext2D): void {
        if (!this.active) return;

        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    private hitTarget(): void {
        this.target.takeDamage(this.damage);
        this.active = false;
    }

    public isActive(): boolean {
        return this.active;
    }
} 