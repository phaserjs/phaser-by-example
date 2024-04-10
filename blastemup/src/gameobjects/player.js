import Particle from "./particle";

class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, name) {
    super(scene, x, y, "ship1_1");
    this.scene = scene;
    this.name = name;
    this.tint = Math.random() * 0xffffff;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    this.body.setCircle(26);
    this.body.setOffset(6, 9);
    this.body.setBounce(0.8);
    this.angle = 0;
    this.speed = 0;
    this.friction = 0.95;
    this.death = false;
    this.init();
  }

  /*
Sets the controls for both cursor keys. Also sets default prooperties for body.
*/
  init() {
    this.cursor = this.scene.input.keyboard.createCursorKeys();
    this.scene.events.on("update", this.update, this);
    this.body.setDrag(300);
    this.body.setAngularDrag(400);
    this.body.setMaxVelocity(600);
    this.upDelta = 0;
  }

  /*
This is a getter so we can get the unique identifier from the name of the player.
*/
  get key() {
    return this.name.split(":")[1];
  }

  /*
The update loop is used to move the spaceship according to the user input. When the player moves to right/left the body of the ship will rotate, when moving up it will gain velocity. Randomly, a trailing particle will be added.
*/
  update(timestep, delta) {
    if (this.death) return;
    if (this.cursor.left.isDown) {
      this.body.setAngularVelocity(-150);
    } else if (this.cursor.right.isDown) {
      this.body.setAngularVelocity(150);
    } else {
      this.body.setAngularVelocity(0);
    }

    if (this.cursor.up.isDown) {
      this.upDelta += delta;
      if (this.upDelta > 200) {
        this.upDelta = 0;
      }
      this.body.setVelocity(
        Math.cos(this.rotation) * 300,
        Math.sin(this.rotation) * 300
      );
    } else {
      this.body.setAcceleration(0);
    }

    if (Phaser.Math.Between(1, 4) > 1) {
      this.scene.thrust.add(
        new Particle(this.scene, this.x, this.y, 0xffffff, 10)
      );
    }
  }

  destroy() {
    this.death = true;
    super.destroy();
  }
}

export default Player;
