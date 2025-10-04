import * as me from "melonjs";

export class Ghost extends me.Sprite {
  constructor(x, y, { color = "#93c5fd", size = 32 } = {}) {
    // Use a colored rectangle renderable (no external asset), or swap to your 'player' image if you prefer
    const canvas = me.video.createCanvas(size, size);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = color; ctx.fillRect(0, 0, size, size);

    super(x, y, { image: canvas });
    this.anchorPoint.set(0, 0);
    this.tx = x; this.ty = y; // interpolation targets
    this.lerp = 12;           // higher = snappier

    this.body = new me.Body(this);
    this.body.addShape(new me.Rect(0,0,this.width,this.height));
    this.body.gravityScale = 0;
    this.body.setKinematic?.(true);                  // obstacle
    this.body.collisionType = me.collision.types.PLAYER_OBJECT;
    this.body.setCollisionMask?.(me.collision.types.PLAYER_OBJECT);
    this.onCollision = () => false;                  // don’t get pushed
    this.body.updateBounds?.()

    this.alwaysUpdate = true;
  }
  setTarget(x, y) { this.tx = x; this.ty = y; }
  update(dt) {
    const k = Math.min(1, (this.lerp * dt) / 1000);
    this.pos.x += (this.tx - this.pos.x) * k;
    this.pos.y += (this.ty - this.pos.y) * k;
    this.isDirty = true;
    return true;
  }
}
