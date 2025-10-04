import * as me from 'melonjs';

// Door as an Entity so it can participate in collisions
export class Border extends me.Entity {
  constructor(x, y, w, h, color = '#000000ff', stage) {
    super(x, y, { width: w, height: h });
    this.floating = false;
    this.color = color;
    this.stage = stage;

    // Set anchor point before creating body
    this.anchorPoint.set(0, 0);

    // create a static body for collisions
    this.body = new me.Body(this);
    this.body.addShape(new me.Rect(0, 0, this.width, this.height));
    this.body.setStatic(true);
    this.body.setCollisionMask(me.collision.types.PLAYER_OBJECT);
    this.body.collisionType = me.collision.types.WORLD_SHAPE;
  }

  draw(renderer) {
    renderer.save();
    renderer.setColor(this.color);
    // draw at local coordinates so it aligns with the entity transform
    renderer.fillRect(0, 0, this.width, this.height);
    renderer.restore();
  }

  onCollision(response, other) {
    console.log('Border.onCollision', { border: this, other });
    return true;
  }
}
