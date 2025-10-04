import * as me from 'melonjs';

export class MeetingAnchor extends me.Sprite {
    constructor(x,y, meetingName) {
        super(x,y, {
            image: "meeting-anchor"
        })

        this.meetingName = meetingName;

        this.resize(32, 32)

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

    // apply physics
    this.body.update(dt);

    // keep sprite updated visually
    return super.update(dt);
  }

  onCollision() {
    // ignore collisions for now
    return false;
  }
}
