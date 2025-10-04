import * as me from "melonjs";

// Door as an Entity so it can participate in collisions
export class Border extends me.Entity {
    constructor(x, y, w, h, color = "#000000ff", stage) {
        super(x, y, { width: w, height: h });
        this.anchorPoint.set(0, 0);
        this.floating = false;
        this.color = color;
        this.stage = stage;

        // create a static body for collisions
        this.body = new me.Body(this);
        this.body.addShape(new me.Rect(0, 0, this.width, this.height));
        this.body.setStatic(true);
        this.body.setCollisionType(me.collision.types.WORLD_SHAPE);
        this.body.setCollisionMask(me.collision.types.PLAYER_OBJECT);
    }

    draw(renderer) {
        renderer.save();
        renderer.setColor(this.color);
        renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height);
        renderer.restore();
    }

    onCollision(response, other) {
    }
}

