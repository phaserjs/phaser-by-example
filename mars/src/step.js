export default class Step extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, name = "step") {
    super(scene, x, y, "step", Phaser.Math.Between(0, 3));
    scene.add.existing(this);
    this.setOrigin(0);
    scene.tweens.add({
      targets: [this],
      duration: 2000,
      alpha: { from: 1, to: 0.1 },
    });
  }
}
