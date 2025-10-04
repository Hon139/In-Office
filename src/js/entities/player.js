import * as me from "melonjs";
import { JitsiState } from "../meeting/meeting-state.js"

export class Player extends me.Sprite {

  constructor(x, y) {
    super(x, y, {
      image: "player",
    });

    this.resize(32, 32);

    // physics body & hitbox
    this.body = new me.Body(this);
    this.body.addShape(new me.Rect(0, 0, this.width, this.height));

    // movement tuning
    this.body.setMaxVelocity(2, 2);  // pixels/sec
    this.body.setFriction(0.0, 0.0);     // top-down feel
    this.alwaysUpdate = true;

    
  }

  update(dt) {
    // reset velocity each frame (top-down)
    this.body.vel.set(0, 0);

    if (me.input.isKeyPressed("left"))  {
      this.body.vel.x = -this.body.maxVel.x;
      JitsiState.activateMeeting();
    }
    if (me.input.isKeyPressed("right")) this.body.vel.x =  this.body.maxVel.x;
    if (me.input.isKeyPressed("up"))    this.body.vel.y = -this.body.maxVel.y;
    if (me.input.isKeyPressed("down"))  this.body.vel.y =  this.body.maxVel.y;


    // apply physics
    this.body.update(dt);

    // keep sprite updated visually
    return super.update(dt);

    // attend meeting
  }

  onCollision() {
    // ignore collisions for now
    return false;
  }
}
