export default class Lightning {
  constructor(scene) {
    this.scene = scene;
  }

  /*
In this method, we create a timeline to show the lightning effect. We use the `lightningEffect` rectangle to show the lightning and the `lightsOut` rectangle to darken the screen.
  */
  lightning() {
    if (Phaser.Math.Between(1, 11) < 10) return;
    const timeline = this.scene.add.timeline();
    timeline.add({
      targets: this.scene.lightningEffect,
      alpha: { from: 0, to: 1 },
      duration: 100,
      repeat: 3,
    });
    if (this.scene.lights.out) {
      timeline.add({
        targets: this.scene.lightsOut,
        alpha: { from: 1, to: 0.5 },
        duration: 500,
      });
    }
    timeline.add({
      targets: this.scene.lightningEffect,
      alpha: { from: 1, to: 0 },
      duration: 2000,
    });
    if (this.scene.lights.out) {
      timeline.add({
        targets: this.scene.lightsOut,
        alpha: { from: 0.5, to: 1 },
        duration: 500,
      });
    }

    timeline.play();
    this.scene.playRandom("thunder" + Phaser.Math.Between(0, 3));
  }
}
