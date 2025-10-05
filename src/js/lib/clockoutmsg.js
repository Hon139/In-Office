// src/js/lib/clockoutmsg.js
import * as me from "melonjs";

export class ClockOutMsg extends me.Renderable {
  constructor(W, H) {
    super(0, 0, W, H);
    this.mainText = new me.Text(W / 2, H / 2 - 8, {
      font: "system-ui",
      size: 36,
      fillStyle: "#ffffff",
      textAlign: "center",
    });

    this.subText = new me.Text(W / 2, H / 2 + 24, {
      font: "system-ui",
      size: 16,
      fillStyle: "#a3a3a3",
      textAlign: "center",
    });
  }

  draw(renderer) {
    this.mainText.draw(renderer, "Yippee, you clocked out!");
    this.subText.draw(renderer, "Press any key or click to go home");
  }

  update() {
    return true;
  }
}
