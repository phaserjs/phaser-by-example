import Bubble from "./bubble";

export default class Bat extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, texture = "bat", ground) {
    super(scene.matter.world, x, y, texture, 0);
    this.label = "bat";
    this.scene = scene;
    this.scene.add.existing(this);
    this.startX = x;
    this.direction = Phaser.Math.RND.pick([-1, 1]);
    this.setFixedRotation();
    this.setIgnoreGravity(true);
    this.addCollisions();
    this.init();
  }

  /*
    Initiate the bat animation and movement. Also, add the update event to the scene so it will update in this class.
  */
  init() {
    this.scene.anims.create({
      key: this.label,
      frames: this.scene.anims.generateFrameNumbers(this.label, {
        start: 0,
        end: 1,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.scene.anims.create({
      key: this.label + "death",
      frames: this.scene.anims.generateFrameNumbers(this.label, {
        start: 2,
        end: 5,
      }),
      frameRate: 5,
    });

    this.anims.play(this.label, true);
    this.on("animationcomplete", this.animationComplete, this);
    this.setVelocityX(this.direction * 5);
    this.scene.events.on("update", this.update, this);
  }

  /*
    We add the collision event to the scene so we can handle the collision with the bat and the bubble.
  */
  addCollisions() {
    this.unsubscribeBatCollide = this.scene.matterCollision.addOnCollideStart({
      objectA: this,
      callback: this.onBatCollide,
      context: this,
    });
  }

  onBatCollide({ gameObjectA, gameObjectB }) {
    if (gameObjectB instanceof Bubble) {
      gameObjectB.load("bat");
      this.destroy();
    }
  }

  /*
    Update the bat movement. If the bat is not moving anymore, we turn it around.
  */
  update() {
    if (!this.active) return;
    if (Math.abs(this.body.velocity.x) <= 0.5) this.turn();
  }

  /*
    This function turns the bat around and sets the velocity to the new direction.
  */
  turn() {
    this.direction = -this.direction;
    this.flipX = this.direction > 0;
    this.setFlipX(this.direction > 0);
    this.setVelocityX(this.direction * 5);
  }

  /*
    We don't destroy the bat directly, we kill the bat and play the death animation.
  */
  death() {
    this.dead = true;
    this.anims.play(this.label + "death");
  }

  /*
    This destroys the bat after the death animation is complete.
  */
  animationComplete(animation, frame) {
    if (animation.key === this.label + "death") {
      this.destroy();
    }
  }
}
