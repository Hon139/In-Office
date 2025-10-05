// src/js/stage/clockout.js
import * as me from "melonjs";
import { ClockOutMsg } from "../lib/clockoutmsg.js"; // default import

export default class ClockOutScreen extends me.Stage {

  onResetEvent() {
    const W = me.game.viewport.width;
    const H = me.game.viewport.height;

    // add the message renderable
    const msg = new ClockOutMsg(W, H);
    me.game.world.addChild(msg, 10);

    // bind keys to a single logical action "ok"
    me.input.bindKey(me.input.KEY.SPACE, "ok", true);
    me.input.bindKey(me.input.KEY.ENTER, "ok", true);
    me.input.bindKey(me.input.KEY.ESC, "ok", true);

    // store handlers so we can remove them later
    this._keydownHandler = me.event.on(me.event.KEYDOWN, (action) => {
      if (action === "ok") this.goHome();
    });
    this._pointerHandler = me.event.on(me.event.POINTERDOWN, () => {
      this.goHome();
    });
  }

  // remove listeners and unbind keys (does NOT change state)
  cleanupHandlers() {
    if (this._keydownHandler) {
      me.event.off(me.event.KEYDOWN, this._keydownHandler);
      this._keydownHandler = null;
    }
    if (this._pointerHandler) {
      me.event.off(me.event.POINTERDOWN, this._pointerHandler);
      this._pointerHandler = null;
    }
    // unbind the keys we bound
    me.input.unbindKey(me.input.KEY.SPACE);
    me.input.unbindKey(me.input.KEY.ENTER);
    me.input.unbindKey(me.input.KEY.ESC);
  }

  goHome() {
    // cleanup input/listeners first
    this.cleanupHandlers();

    // change to the home/play state (adjust if you have a MENU state)
    me.state.change(me.state.PLAY);
  }

  onDestroyEvent() {
    // ensure handlers are cleaned up if the stage is destroyed another way
    this.cleanupHandlers();
  }
}
