export class Enemy {
    public x: number;
    public y: number;
    private speed: number;
    private health: number;
    private contextWidth: number;
    private path: Array<{x: number, y: number}>;
    private currentWaypointIndex: number = 0;

    constructor(x: number, y: number, contextWidth: number, health: number, path: Array<{x: number, y: number}>) {
        this.x = x;
        this.y = y;
        this.contextWidth = contextWidth;
        this.health = health;
        this.speed = 1 + Math.random(); // 약간의 랜덤 속도 추가
        this.path = path;
    }

    /**
     * 적의 상태를 업데이트합니다. 경로를 따라 이동합니다.
     */
    public update(deltaTime: number): void {
        if (this.currentWaypointIndex >= this.path.length) {
            // 경로의 끝에 도달했을 때 추가 로직을 수행할 수 있습니다.
            return;
        }

        const target = this.path[this.currentWaypointIndex];
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const distance = Math.hypot(dx, dy);

        if (distance < this.speed) {
            // 현재 웨이포인트에 도달했으므로 다음 웨이포인트로 이동
            this.x = target.x;
            this.y = target.y;
            this.currentWaypointIndex++;
        } else {
            // 현재 웨이포인트를 향해 이동
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        }
    }

    /**
     * 적이 경로의 끝에 도달했는지 여부를 반환합니다.
     */
    public hasReachedEnd(): boolean {
        return this.currentWaypointIndex >= this.path.length;
    }

    /**
     * 적을 캔버스에 렌더링합니다.
     * @param ctx - CanvasRenderingContext2D 객체
     */
    public render(ctx: CanvasRenderingContext2D): void {
        // 적 그리기
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
        ctx.fill();

        // 체력 바 그리기
        ctx.fillStyle = 'green';
        const healthBarWidth = (this.health / 100) * 20;
        ctx.fillRect(this.x - 10, this.y - 15, healthBarWidth, 3);
    }

    /**
     * 적에게 데미지를 입힙니다.
     * @param amount - 입힐 데미지 양
     */
    public takeDamage(amount: number): void {
        this.health -= amount;
        if (this.health < 0) {
            this.health = 0;
        }
    }

    /**
     * 적이 사망했는지 여부를 반환합니다.
     * @returns 적이 사망했으면 true, 아니면 false
     */
    public isDead(): boolean {
        return this.health <= 0;
    }

    /**
     * 적의 체력을 반환합니다.
     */
    public getHealth(): number {
        return this.health;
    }
} 