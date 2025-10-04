// src/js/start-game.js
import * as me from "melonjs";
import { SocketNet } from "./net.js";
import PlayScreen from "./stage/play.js";

export async function startGame({ token, profile }) {
  // init melonJS if you weren’t already doing it here
  // me.video.init(...)

  // store globally if your scene wants to read name/picture
  window.__APP__ = { token, profile };

  me.state.set(me.state.PLAY, new PlayScreen());
  me.state.change(me.state.PLAY);
}
