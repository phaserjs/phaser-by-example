export default class Dust extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, name = "dust", tween = false) {
    super(scene, x, y, name);
    this.scene = scene;
    this.name = name;
    this.setScale(0.5);
    this.scene.add.existing(this);
    this.init(tween);
  }

  /*
    This dust is a simple sprite that plays an animation and then destroys itself. It's used when the player lands, slides on a wall, or jumps. We can optionally add a tween to make it fade out.
  */
  init(tween) {
    if (tween) {
      this.scene.tweens.add({
        targets: this,
        duration: Phaser.Math.Between(500, 1000),
        alpha: { from: 1, to: 0 },
        onComplete: () => {
          this.destroy();
        },
      });
    }

    this.scene.anims.create({
      key: this.name,
      frames: this.scene.anims.generateFrameNumbers(this.name, {
        start: 0,
        end: 10,
      }),
      frameRate: 10,
    });
    this.on("animationcomplete", this.animationComplete, this);
    this.anims.play(this.name, true);
  }

  animationComplete() {
    this.destroy();
  }
}
