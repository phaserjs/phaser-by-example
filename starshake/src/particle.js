export class LightParticle extends Phaser.GameObjects.PointLight {
  constructor(scene, x, y, color = 0xffffff, radius = 5, intensity = 0.5) {
    super(scene, x, y, color, radius, intensity);
    this.name = "celtic";
    this.scene = scene;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    this.body.setVelocityY(300);
    this.init();
  }

  /*
    We add a tween to the particle to make it grow and fade out.
    */
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
