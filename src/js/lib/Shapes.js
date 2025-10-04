import * as me from "melonjs";
export class SimpleRect extends me.Renderable {
    constructor(x, y, w, h, color = "#cc4444") {
        super(x, y, w, h);
        this.anchorPoint.set(0, 0);
        this.floating = false; // remain fixed in viewport
        this.color = color;
    }

    draw(renderer) {
        renderer.save();
        renderer.setColor(this.color);
        renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height);
        renderer.restore();
    }
}