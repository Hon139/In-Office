import * as me from 'melonjs';
import { openMeeting, closeMeeting } from '../meeting/meeting-state.js';
import { Door } from '../lib/door.js';

export class Player extends me.Sprite {
  constructor(x, y) {
    super(x, y, {
      image: window.playerAvatar,
    });

    this.resize(32, 32);
    const canvas = me.video.createCanvas(32, 32);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#93c5fd';
    ctx.fillRect(0, 0, 32, 32);

    this.anchorPoint.set(0, 0);

    this.name = window.playerName;

    // physics body & hitbox
    this.body = new me.Body(this);
    this.body.addShape(new me.Rect(0, 0, this.width, this.height));
    this.body.collisionType = me.collision.types.PLAYER_OBJECT;
    this.body.setCollisionMask(me.collision.types.WORLD_SHAPE | me.collision.types.PLAYER_OBJECT);
    // movement tuning
    this.body.setMaxVelocity(2, 2); // pixels/sec
    this.body.setFriction(0.0, 0.0); // top-down feel
    this.inAMeeting = false;
    this.collided = false;
  }

  update(dt) {
    // reset velocity each frame (top-down)
    this.body.vel.set(0, 0);

    if (!this.inAMeeting) {
      if (me.input.isKeyPressed('left')) {
        this.body.vel.x = -this.body.maxVel.x;
        if (this.collided) this.collided = false;
      }
      if (me.input.isKeyPressed('right')) {
        this.body.vel.x = this.body.maxVel.x;
        if (this.collided) this.collided = false;
      }
      if (me.input.isKeyPressed('up')) {
        this.body.vel.y = -this.body.maxVel.y;
        if (this.collided) this.collided = false;
      }
      if (me.input.isKeyPressed('down')) {
        this.body.vel.y = this.body.maxVel.y;
        if (this.collided) this.collided = false;
      }
      if (me.input.isKeyPressed('enter')) {
      }
    } else {
      if (me.input.isKeyPressed('quit')) {
        closeMeeting();
        this.inAMeeting = false;
        setTimeout(() => {
          this.tempControl = false;
        }, 5000);
      }
    }

    // apply physics
    this.body.update(dt);

    // keep sprite updated visually
    return super.update(dt);

    // attend meeting
  }

  leaveMeeting() {
    this.inAMeeting = false;
  }

  onCollision(response, other) {
    if (other instanceof Door) {
      if (!this.collided) {
        this.inAMeeting = true;
        this.meetingCooldown = true;
        openMeeting(other.getName(), this);
        this.collided = true;
      }
    }

    return true;
  }
}
