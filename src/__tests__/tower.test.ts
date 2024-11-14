// src/__tests__/tower.test.ts
import { Tower } from '../tower';
import { Enemy } from '../enemy';

describe('Tower', () => {
  let tower: Tower;
  let enemy: Enemy;
  const samplePath = [
    { x: 100, y: 300 },
    { x: 300, y: 300 },
    { x: 300, y: 200 },
    { x: 500, y: 200 },
    { x: 500, y: 400 },
    { x: 700, y: 400 },
  ];

  beforeEach(() => {
    tower = new Tower(100, 100);
    enemy = new Enemy(0, 100, 800, 30, samplePath);
  });

  test('should initialize correctly', () => {
    expect(tower).toBeDefined();
    expect(tower.getUpgradeCost()).toBe(50);
  });

  test('should upgrade correctly', () => {
    tower.upgrade();
    expect(tower.getUpgradeCost()).toBe(100);
  });

  test('should shoot at enemy and damage it', () => {
    const initialHealth = enemy.getHealth();
    tower.shoot(enemy);

    let hit = false;
    for (let i = 0; i < 100; i++) {
      tower.update(1 / 60, [enemy]);
      if (enemy.getHealth() === initialHealth - 25) {
        hit = true;
        break;
      }
    }

    expect(hit).toBe(true);
    expect(enemy.getHealth()).toBe(initialHealth - 25);
  });
});