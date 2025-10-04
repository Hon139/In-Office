import * as me from "melonjs";

// Door as an Entity so it can participate in collisions
export class Door extends me.Entity {
    constructor(x, y, w, h, color = "#cc4444", name) {
        super(x, y, { width: w, height: h });
        this.floating = false;
        this.color = color;
        this.name = name;

        // Set anchor point before creating body
        this.anchorPoint.set(0, 0);

        this.body = new me.Body(this);
        this.body.addShape(new me.Rect(0, 0, w, h));
        this.body.gravityScale = 0;
        // static obstacle; cannot be pushed
        this.body.setKinematic?.(true);
        // mark as “world” so players collide with it
        this.body.collisionType = me.collision.types.WORLD_SHAPE;
        this.body.updateBounds?.();
    }

    draw(renderer) {
        renderer.setColor(this.color);
        // draw at local coordinates so it aligns with the entity transform
        renderer.fillRect(0, 0, this.width, this.height);
    }

    // called when something collides with this door
    onCollision(response) {
        console.log("collision with door");
        // me.state.change(this.stage);
        return false; 
    }

    getName() {
        return this.name;
    }
}

