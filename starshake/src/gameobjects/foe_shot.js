const TYPES = {
  chocolate: { color: 0xaf8057, radius: 16, intensity: 0.4 },
  vanila: { color: 0xfff6d5, radius: 16, intensity: 0.4 },
  fruit: { color: 0x00ff00, radius: 16, intensity: 0.4 },
  water: { color: 0x0000cc, radius: 16, intensity: 0.4 },
  foe: { color: 0xfff01f, radius: 16, intensity: 0.4 },
};

class FoeShot extends Phaser.GameObjects.PointLight {
  constructor(
    scene,
    x,
    y,
    type = "water",
    playerName,
    velocityX = 0,
    velocityY = -300
  ) {
    const { color, radius, intensity } = TYPES[type];
    super(scene, x, y, color, radius, intensity);
    this.name = "foeshot";
    this.scene = scene;
    this.playerName = playerName;
    this.spawnShadow(x, y, velocityX, velocityY);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    if (playerName === "guinxu") this.body.setVelocity(velocityX, velocityY);
    this.body.setAllowGravity(false);
    this.body.setCollideWorldBounds(true);
    this.body.onWorldBounds = true;
    this.body.setCircle(10);
    this.body.setOffset(6, 9);

    this.init();
  }

  /*
    This function spawns a shadow for each shot. We'll have to update it with the shot itself.
    */
  spawnShadow(x, y, velocityX, velocityY) {
    this.shadow = this.scene.add
      .circle(x + 20, y + 20, 10, 0x000000)
      .setAlpha(0.4);
    this.scene.add.existing(this.shadow);
    this.scene.physics.add.existing(this.shadow);
    if (this.playerName === "guinxu")
      this.shadow.body.setVelocity(velocityX, velocityY);
  }

  /*
    This function adds a simple effect to the shot to make it flicker.
    */
  init() {
    this.scene.tweens.add({
      targets: this,
      duration: 200,
      intensity: { from: 0.3, to: 0.7 },
      repeat: -1,
    });
  }

  /*
    This function is called when the shot is destroyed, adding an explosion effect along with a tween and showing the points.
    */
  shot() {
    const explosion = this.scene.add
      .circle(this.x, this.y, 5)
      .setStrokeStyle(10, 0xffffff);
    this.showPoints(50);
    this.scene.tweens.add({
      targets: explosion,
      radius: { from: 5, to: 20 },
      alpha: { from: 1, to: 0 },
      duration: 250,
      onComplete: () => {
        explosion.destroy();
      },
    });
    this.destroy();
  }

  /*
    This function shows the points when the shot is destroyed. The points are shown in a bitmap text and they are tweened to make them move up and fade out.
    */
  showPoints(score, color = 0xff0000) {
    let text = this.scene.add
      .bitmapText(this.x + 20, this.y - 30, "wendy", "+" + score, 40, color)
      .setOrigin(0.5);
    this.scene.tweens.add({
      targets: text,
      duration: 800,
      alpha: { from: 1, to: 0 },
      y: { from: this.y - 20, to: this.y - 80 },
      onComplete: () => {
        text.destroy();
      },
    });
  }
}

export default FoeShot;
