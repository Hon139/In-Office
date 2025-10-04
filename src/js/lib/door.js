import * as me from "melonjs";

// Door as an Entity so it can participate in collisions
export class Door extends me.Entity {
    constructor(x, y, w, h, color = "#cc4444", stage) {
        super(x, y, { width: w, height: h });
        this.anchorPoint.set(0, 0);
        this.floating = false;
        this.color = color;
        this.stage = stage;

        // create a static body for collisions
        this.body = new me.Body(this);
        this.body.addShape(new me.Rect(0, 0, this.width, this.height));
        this.body.setStatic(true);
        // mark as a world/action shape so player can detect it
        if (typeof this.body.setCollisionType === 'function') {
            this.body.setCollisionType(me.collision.types.WORLD_SHAPE);
        } else {
            this.body.collisionType = me.collision.types.WORLD_SHAPE || 0;
        }
        if (typeof this.body.setCollisionMask === 'function') {
            this.body.setCollisionMask(me.collision.types.PLAYER_OBJECT);
        }
    }

    draw(renderer) {
        renderer.save();
        renderer.setColor(this.color);
        renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height);
        renderer.restore();
    }

    // called when something collides with this door
    onCollision(response, other) {
        // // other is the colliding entity (e.g., Player)
        // // return false to let default collision response happen (no physical response)
        // // we can trigger level change or event here
        // console.log("Door.onCollision", { door: this, other });
        // if (typeof this.stage === "string") {
        //     // a simple example: change state
        //     me.state.change(this.stage);
        // }
        // return false;
    }
}

