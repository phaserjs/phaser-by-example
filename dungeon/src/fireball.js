export default class Fireball extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, direction) {
    super(scene.matter.world, x, y, "fireball", 0);
    this.label = "fireball";
    this.scene = scene;
    this.direction = direction;
    scene.add.existing(this);
    this.setIgnoreGravity(true);
    this.setVelocityX(5 * this.direction);
    this.setVelocityY(Phaser.Math.Between(0, -8));
    this.setBounce(1);
    this.init();
  }

  /*
    We create the animation for the fireball and add the update event to the scene so it will update in this class.
  */
  init() {
    this.scene.events.on("update", this.update, this);
    this.tween = this.scene.tweens.add({
      targets: this,
      duration: 200,
      scale: { from: 0.9, to: 1 },
      repeat: -1,
    });
    this.scene.time.delayedCall(
      3000,
      () => {
        this.destroy();
      },
      null,
      this
    );
  }

  update() {
    if (this.scene?.gameOver) return;
  }

  destroy() {
    this.tween.destroy();
    super.destroy();
  }
}
