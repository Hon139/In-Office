import * as me from 'melonjs';
import { Player } from '../entities/player.js';
import { SimpleRect } from '../lib/Shapes.js';
import { Door } from '../lib/door.js';
import { Border } from '../lib/boarder.js';

export default class RoomScreen extends me.Stage {
  onResetEvent() {
    me.game.world.addChild(new me.ColorLayer('bg', '#bfbfd2ff'), 0);
    me.input.bindKey(me.input.KEY.LEFT, 'left');
    me.input.bindKey(me.input.KEY.A, 'left');
    me.input.bindKey(me.input.KEY.RIGHT, 'right');
    me.input.bindKey(me.input.KEY.D, 'right');
    me.input.bindKey(me.input.KEY.UP, 'up');
    me.input.bindKey(me.input.KEY.W, 'up');
    me.input.bindKey(me.input.KEY.DOWN, 'down');
    me.input.bindKey(me.input.KEY.S, 'down');
    me.input.bindKey(me.input.KEY.Q,     "quit");
    me.input.bindKey(me.input.KEY.E,     "enter");

    // disable gravity
    me.game.world.gravity.set(0, 0);

    // add player
    const player = new Player(100, 100);
    me.game.world.addChild(player, 10);

    const rect = new SimpleRect(20, 20, 120, 80, "#55aaff");
    const border = new Border(0, 0, 800, 20, "#000000ff");
    const door = new Door(400, 200, 80, 120, "#ffaa55", "door1", me.state.PLAY);
    me.game.world.addChild(border, 1);
    me.game.world.addChild(door, 1);
    me.game.world.addChild(rect, 1);
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
