export default class Zombie extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type = "right") {
    super(scene, x, y, "zombie");
    this.name = "zombie";
    this.scene = scene;
    this.scene.physics.add.existing(this);
    this.scene.physics.world.enable(this);
    this.body.setAllowGravity(true);
    this.scene.add.existing(this);
    this.direction = type === "right" ? -1 : 1;

    this.init();
  }

  /*
  As we did with the Bat. Inits the animations for the zombies and starts the movement. We also add a listener for the `animationcomplete` event.
  */
  init() {
    this.scene.anims.create({
      key: this.name,
      frames: this.scene.anims.generateFrameNumbers(this.name, {
        start: 0,
        end: 2,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.scene.anims.create({
      key: this.name + "death",
      frames: this.scene.anims.generateFrameNumbers(this.name, {
        start: 3,
        end: 5,
      }),
      frameRate: 5,
    });

    this.anims.play(this.name, true);
    this.body.setVelocityX(this.direction * 100);
    this.flipX = this.direction < 0;
    this.on("animationcomplete", this.animationComplete, this);
  }

  /*
  Turns the zombie around and changes the direction
  */
  turn() {
    this.direction = -this.direction;
    this.flipX = this.direction < 0;
    this.body.setVelocityX(this.direction * 100);
  }

  /*
  This kills the zombie "nicely" by playing the death animation.
  */
  death() {
    this.dead = true;
    this.body.enable = false;
    this.body.rotation = 0;
    this.anims.play(this.name + "death");
  }

  /*
  Again, when the death animation is completed, then it destroys the zombie.
  */
  animationComplete(animation, frame) {
    if (animation.key === this.name + "death") {
      this.destroy();
    }
  }
}
