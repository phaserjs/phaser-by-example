class Particle extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, color = 0xffffff, size = 4, alpha = 1) {
    super(scene, x, y, size, size, color, alpha);
    this.name = "bubble";
    this.scene = scene;
    this.alpha = alpha;
    this.setOrigin(0.5);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    this.init();
  }

  init() {
    this.scene.tweens.add({
      targets: this,
      duration: Phaser.Math.Between(600, 1000),
      scale: { from: 1, to: 3 },
      alpha: { from: this.alpha, to: 0 },
      onComplete: () => {
        this.destroy();
      },
    });
  }
}

export default Particle;
