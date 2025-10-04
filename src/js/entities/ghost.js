import * as me from 'melonjs';

export class Ghost extends me.Sprite {
  constructor(x, y, { color = '#93c5fd', size = 32 } = {}) {
    // Use a colored rectangle renderable (no external asset), or swap to your 'player' image if you prefer
    const canvas = me.video.createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, size, size);

    super(x, y, { image: canvas });
    this.anchorPoint.set(0.5, 0.5);
    this.tx = x;
    this.ty = y; // interpolation targets
    this.lerp = 12; // higher = snappier
    this.alwaysUpdate = true;
  }
  setTarget(x, y) {
    this.tx = x;
    this.ty = y;
  }
  update(dt) {
    const k = Math.min(1, (this.lerp * dt) / 1000);
    this.pos.x += (this.tx - this.pos.x) * k;
    this.pos.y += (this.ty - this.pos.y) * k;
    this.isDirty = true;
    return true;
  }
}
