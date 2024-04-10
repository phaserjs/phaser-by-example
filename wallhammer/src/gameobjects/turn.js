class Turn extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, width = 32, height = 32, type = "") {
    super(scene, x, y, width, height, 0xffffff);
    this.type = type;
    this.setAlpha(0);
    this.x = x;
    this.y = y;
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.immovable = true;
    this.body.moves = false;
  }

  disable() {
    this.visible = false;
    this.destroy();
  }

  destroy() {
    super.destroy();
  }
}

export default Turn;
