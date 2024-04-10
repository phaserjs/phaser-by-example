export default class Hole extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "hole");
    this.name = "hole";
    this.setOrigin(0);
    this.setAlpha(0);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
  }
}
