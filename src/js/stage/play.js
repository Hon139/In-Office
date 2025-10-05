import * as me from 'melonjs';
import { MeetingAnchor } from '../entities/meeting-anchor.js';
import { SocketNet } from '../net.js';
import { Ghost } from '../entities/ghost.js';
import { Player } from '../entities/player.js'; // your existing local player
import { Door } from '../lib/door.js';

export default class PlayScreen extends me.Stage {
  async onResetEvent() {
    me.level.load('VirtualOfficeMock');
    // const startPosition = me.levelDirector.getCurrentLevel().getObjectByName("playerStart")
    // this.me = new Player(startPosition.x, startPosition.y);

    me.game.world.gravity.set(0, 0);
    me.game.world.addChild(new me.ColorLayer('bg', '#202025'), 0);

    // Local player
    this.me = new Player(300, 100);
    me.game.world.addChild(this.me, 100);
    me.game.viewport.follow(this.me.pos, me.game.viewport.AXIS.BOTH, 0.15);

    // Multiplayer
    this.ghosts = new Map();
    this.net = new SocketNet(window.CONFIG.WS_URL); // ← your WS URL (wss:// in prod)
    const name = window.playerName + Math.floor(Math.random() * 1000);
    console.log("play avatar: " + window.playerAvatar);
    await this.net.connect({ room: 'main', name, avatar: window.playerAvatar });

    // Handle server events
    this.net.onEvents((evt) => {
      if (evt.type === 'init') {
        evt.players.forEach((p) => this.spawnGhost(p));
      } else if (evt.type === 'add') {
        this.spawnGhost(evt.player);
      } else if (evt.type === 'upd') {
        const g = this.ghosts.get(evt.player.id);
        if (g) g.setTarget(evt.player.x, evt.player.y);
      } else if (evt.type === 'del') {
        const g = this.ghosts.get(evt.uid);
        if (g) {
          me.game.world.removeChild(g);
          this.ghosts.delete(evt.uid);
        }
      }
    });

    // Input bindings (if not already)
    me.input.bindKey(me.input.KEY.LEFT, 'left');
    me.input.bindKey(me.input.KEY.A, 'left');
    me.input.bindKey(me.input.KEY.RIGHT, 'right');
    me.input.bindKey(me.input.KEY.D, 'right');
    me.input.bindKey(me.input.KEY.UP, 'up');
    me.input.bindKey(me.input.KEY.W, 'up');
    me.input.bindKey(me.input.KEY.DOWN, 'down');
    me.input.bindKey(me.input.KEY.S, 'down');
    me.input.bindKey(me.input.KEY.Q, 'quit');
    me.input.bindKey(me.input.KEY.E, 'enter');
    me.input.bindKey(me.input.KEY.R, 'record');

    // Throttle state sends
    this.lastSend = 0;
    this.sendHz = 10; // 10 updates per second
    this.lastX = this.me.pos.x;
    this.lastY = this.me.pos.y;

    const meeting_room = new Door(800, 65, 125, 125, '#ff8c8cff', 'Meeting Room');
    const break_room = new Door(710, 385, 57, 190, '#ff8c8cff', 'Break Room');

    me.game.world.addChild(meeting_room, 1);
    me.game.world.addChild(break_room, 1);

  }

  spawnGhost(p) {
    console.log(p.avatar + " " + p.id);
    if (p.id === this.net.uid) return; // don't spawn self
    if (this.ghosts.has(p.id)) return;
    const g = new Ghost(p.x, p.y, p.avatar);
    me.game.world.addChild(g, 9);
    this.ghosts.set(p.id, g);
  }

  update(dt) {
    // your Player.update handles movement; just send position if changed (throttled)
    const now = me.timer.getTime();
    const moved =
      Math.abs(this.me.pos.x - this.lastX) > 1 || Math.abs(this.me.pos.y - this.lastY) > 1;
    if (moved && now - this.lastSend > 1000 / this.sendHz) {
      this.lastSend = now;
      this.lastX = this.me.pos.x;
      this.lastY = this.me.pos.y;
      const dir = 'D'; // optional: compute from keys
      this.net.sendState({ x: this.me.pos.x, y: this.me.pos.y, dir });
    }
    return super.update(dt);
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
    me.input.unbindKey(me.input.KEY.Q);
    me.input.unbindKey(me.input.KEY.E);
    this.net?.disconnect();
    this.lastSend = 0;
    this.sendHz = 10; // 10 updates per second
    this.lastX = this.me.pos.x;
    this.lastY = this.me.pos.y;
  }
}
