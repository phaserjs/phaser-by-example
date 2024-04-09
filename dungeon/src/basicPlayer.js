
export default class Player {
    constructor (scene, x, y) {
        this.scene = scene;
        this.init(x,y);
        this.moveForce = 0.01;
    }

    init (x,y) {
            // Create the physics-based sprite that we will move around and animate
        this.sprite = this.scene.matter.add.sprite(0, 0, "player", 0);

        const { Body, Bodies } = Phaser.Physics.Matter.Matter; // Native Matter modules
        const { width: w, height: h } = this.sprite;
        const mainBody = Bodies.rectangle(0, 0, w * 0.6, h, { chamfer: { radius: 10 } });
        this.sensors = {
            bottom: Bodies.rectangle(0, h * 0.5, w * 0.25, 2, { isSensor: true }),
            left: Bodies.rectangle(-w * 0.35, 0, 2, h * 0.5, { isSensor: true }),
            right: Bodies.rectangle(w * 0.35, 0, 2, h * 0.5, { isSensor: true })
        };
        const compoundBody = Body.create({
            parts: [mainBody, this.sensors.bottom, this.sensors.left, this.sensors.right],
            frictionStatic: 0,
            frictionAir: 0.02,
            friction: 0.1,
            // The offset here allows us to control where the sprite is placed relative to the
            // matter body's x and y - here we want the sprite centered over the matter body.
            render: { sprite: { xOffset: 0.5, yOffset: 0.5 } },
        });
        this.sprite.setExistingBody(compoundBody).setScale(1)
            .setFixedRotation() // Sets inertia to infinity so the player can't rotate
            .setPosition(x, y);
        this.addControls();
        this.scene.events.on("update", this.update, this);
    }

    addControls() {
        this.cursor = this.scene.input.keyboard.createCursorKeys();
        this.W = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.A = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.S = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.D = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D); 

    }

    update(time, delta) {
        if (this.D.isDown || this.cursor.right.isDown) {
            this.sprite.setFlipX(false);
            this.sprite.applyForce({ x: this.moveForce, y: 0 });
        } else if (this.A.isDown || this.cursor.left.isDown) {
            this.sprite.setFlipX(true);
            this.sprite.applyForce({ x: -this.moveForce, y: 0 });
        }

        if (this.sprite.body.velocity.x > 7) this.sprite.setVelocityX(7);
        else if (this.sprite.body.velocity.x < -7) this.sprite.setVelocityX(-7);

        if (this.sprite.body.velocity.y === 0  && (this.W.isDown || this.cursor.up.isDown))  {            
            this.sprite.setVelocityY(-11);
        }
    }



    step (x, y) {

    }

    land (x, y) {

    }

}