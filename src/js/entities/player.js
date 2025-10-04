import * as me from "melonjs";

export class Player extends me.Sprite {
  constructor(x, y) {
    super(x, y, {
      image: "player",
    });

    this.resize(32, 32);

    // physics body & hitbox
    this.body = new me.Body(this);
    this.body.addShape(new me.Rect(0, 0, this.width, this.height));
    // this.body.setCollisionType(me.collision.types.PLAYER_OBJECT);
    // this.body.setCollisionMask(me.collision.types.WORLD_SHAPE);
    // movement tuning
    this.body.setMaxVelocity(2, 2);  // pixels/sec
    this.body.setFriction(0.0, 0.0);     // top-down feel
    this.alwaysUpdate = true;
  }

  update(dt) {
    // reset velocity each frame (top-down)
    this.body.vel.set(0, 0);

    if (me.input.isKeyPressed("left"))  this.body.vel.x = -this.body.maxVel.x;
    if (me.input.isKeyPressed("right")) this.body.vel.x =  this.body.maxVel.x;
    if (me.input.isKeyPressed("up"))    this.body.vel.y = -this.body.maxVel.y;
    if (me.input.isKeyPressed("down"))  this.body.vel.y =  this.body.maxVel.y;

    // apply physics
    this.body.update(dt);

    // keep sprite updated visually
    return super.update(dt);
  }

  onCollision() {
    // default: let collisions pass through visually (no physical response)
    // but check if we collided with a Door entity and handle it
    // arguments passed by melonJS to onCollision are (response, other)
    // some melonJS builds pass different args; defensively handle both cases
    // const args = Array.from(arguments);
    // let other = null;
    // if (args.length === 1) {
    //   other = args[0].body ? args[0].body.owner : null;
    // } else if (args.length >= 2) {
    //   other = args[1];
    // }

    // if (other) {
    //   // if the other object has onCollision and its constructor name contains 'Door', call it
    //   if (other.constructor && other.constructor.name === 'Door') {
    //     if (typeof other.onCollision === 'function') {
    //       other.onCollision(args[0], this);
    //     }
    //   }
    // }

    // return false so melonJS does not resolve the collision physically
    return false;
  }
}
