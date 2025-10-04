import * as me from "melonjs";
import { Player } from "../entities/player.js";
import { MeetingAnchor } from "../entities/meeting-anchor.js"

export default class PlayScreen extends me.Stage {
  onResetEvent() {
    // simple background (optional)
    me.game.world.addChild(new me.ColorLayer("bg", "#202025"), 0);

    // input (arrow keys & WASD)
    me.input.bindKey(me.input.KEY.LEFT,  "left");
    me.input.bindKey(me.input.KEY.A,     "left");
    me.input.bindKey(me.input.KEY.RIGHT, "right");
    me.input.bindKey(me.input.KEY.D,     "right");
    me.input.bindKey(me.input.KEY.UP,    "up");
    me.input.bindKey(me.input.KEY.W,     "up");
    me.input.bindKey(me.input.KEY.DOWN,  "down");
    me.input.bindKey(me.input.KEY.S,     "down");

    // disable gravity
    me.game.world.gravity.set(0, 0);

    // add player
    const player = new Player(100, 100);
    me.game.world.addChild(player, 10);

    // Add a portal into the thing
    const meetingAnchor = new MeetingAnchor(200, 200);
    me.game.world.addChild(meetingAnchor, 9);

    // center camera on player
    me.game.viewport.follow(player.pos, me.game.viewport.AXIS.BOTH, 0.15);
  }

  onDestroyEvent() {
    me.input.unbindKey(me.input.KEY.LEFT);
    me.input.unbindKey(me.input.KEY.A);
    me.input.unbindKey(me.input.KEY.RIGHT);
    me.input.unbindKey(me.input.KEY.D);
    me.input.unbindKey(me.input.KEY.UP);
    me.input.unbindKey(me.input.KEY.W);
    me.input.unbindKey(me.input.KEY.DOWN);
    me.input.unbindKey(me.input.KEY.S);
  }
}
