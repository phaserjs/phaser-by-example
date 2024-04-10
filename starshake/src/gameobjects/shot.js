const TYPES = {
  chocolate: { color: 0xaf8057, radius: 16, intensity: 0.4 },
  vanila: { color: 0xfff6d5, radius: 16, intensity: 0.4 },
  fruit: { color: 0xffffff, radius: 16, intensity: 0.4 },
  water: { color: 0xffffff, radius: 16, intensity: 0.4 },
  foe: { color: 0x00ff00, radius: 16, intensity: 0.4 },
};

class Shot extends Phaser.GameObjects.PointLight {
  constructor(
    scene,
    x,
    y,
    type = "water",
    playerName,
    velocityX = 0,
    velocityY = -500
  ) {
    const { color, radius, intensity } = TYPES[type];
    super(scene, x, y, color, radius, intensity);
    this.name = "shot";
    this.playerName = playerName;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    this.body.setVelocityX(velocityX);
    this.body.setVelocityY(velocityY);
    this.body.setCircle(10);
    this.body.setOffset(6, 9);
    this.body.setCollideWorldBounds(true);
    this.body.onWorldBounds = true;
    this.spawnShadow(x, y, velocityX, velocityY);
    this.init();
  }

  /*
   Each shot will have a shadow, which will be a circle with a lower alpha value.
    */
  spawnShadow(x, y, velocityX, velocityY) {
    this.shadow = this.scene.add
      .circle(x + 20, y + 20, 10, 0x000000)
      .setAlpha(0.4);
    this.scene.add.existing(this.shadow);
    this.scene.physics.add.existing(this.shadow);
    this.shadow.body.setVelocityX(velocityX);
    this.shadow.body.setVelocityY(velocityY);
  }

  /*
    We add a tween to the shot to make it grow and fade out, repeatedly.
    */
  init() {
    this.scene.tweens.add({
      targets: this,
      duration: 200,
      intensity: { from: 0.3, to: 0.7 },
      repeat: -1,
    });
  }
}

export default Shot;
