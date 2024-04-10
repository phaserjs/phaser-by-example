export default class Block extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, name = "block_blue", velocity = 100) {
    super(scene, x, y, name);
    this.setOrigin(0, 0);
    this.scene = scene;
    this.name = name;
  }
}
