export class ShotSmoke extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, directionX, directionY, color = 0xffeaab) {
    x += Phaser.Math.Between(-30, 30);
    y += Phaser.Math.Between(-30, 30);
    const width = Phaser.Math.Between(30, 55);
    const height = Phaser.Math.Between(30, 55);
    super(scene, x, y, width, height, color);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    this.body.setVelocityX(100 * directionX);
    this.body.setVelocityY(100 * directionY);
    this.init();
  }

  init() {
    this.scene.tweens.add({
      targets: this,
      duration: 800,
      scale: { from: 1, to: 0 },
      onComplete: () => {
        this.destroy();
      },
    });
  }
}
