export default class Bat extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type = "right") {
    super(scene, x, y, "bat");
    this.name = "bat";
    this.scene.physics.add.existing(this);
    this.scene.physics.world.enable(this);
    this.body.setAllowGravity(false);
    this.scene.add.existing(this);
    this.direction = type === "right" ? 1 : -1;

    this.init();
  }
  /*
    Inits the animations for the bat and starts the movement. We also add a listener for the `animationcomplete` event.
    */
  init() {
    this.scene.anims.create({
      key: this.name,
      frames: this.scene.anims.generateFrameNumbers(this.name, {
        start: 0,
        end: 1,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.scene.anims.create({
      key: this.name + "death",
      frames: this.scene.anims.generateFrameNumbers(this.name, {
        start: 2,
        end: 5,
      }),
      frameRate: 5,
    });

    this.anims.play(this.name, true);
    this.body.setVelocityX(this.direction * 150);
    this.flipX = this.direction > 0;
    this.on("animationcomplete", this.animationComplete, this);
  }

  update() {}

  /*
    Turns the bat around and changes the direction
    */
  turn() {
    this.direction = -this.direction;
    this.flipX = this.direction > 0;
    this.body.setVelocityX(this.direction * 150);
  }

  /*
    This kills the bat "nicely" by playing the death animation.
    */
  death() {
    this.dead = true;
    this.body.enable = false;
    this.body.rotation = 0;
    this.anims.play(this.name + "death");
  }

  /*
    This is called when any animation is completed. If the death animation is completed, then it destroys the bat.
    */
  animationComplete(animation, frame) {
    if (animation.key === this.name + "death") {
      this.destroy();
    }
  }
}
