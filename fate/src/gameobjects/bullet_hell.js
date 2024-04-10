export default class BulletHell {
  constructor() {
    this._functions = [
      this.flat,
      this.tlaf,
      this.horizontal,
      this.multiWave,
      this.cos,
      this.tan,
      this.ripple,
    ];
  }

  get functions() {
    return this._functions;
  }

  /*
    These are different functions that we will use to generate the path of the bullets. They're quite simple, but you can create your own functions to generate more complex paths.
    We will use the x, y, z and time parameters to generate different patterns.
  */
  sin(x, time) {
    return Math.sin(x);
  }

  flat(x, y, z) {
    return x + z;
  }

  tlaf(x, y, z) {
    return -x - z;
  }

  horizontal(x, y, z) {
    return z;
  }

  wave(x, time) {
    return Math.sin(Math.PI * (x + time));
  }

  multiWave(x, time) {
    return Math.sin(Math.PI * (x + time));
  }

  cos(x, time, z) {
    return Math.cos(x) * Phaser.Math.Between(0.1, 0.9);
  }

  tan(x, time, z) {
    return Math.tan(x);
  }

  ripple(x, time, z) {
    return Math.sin(time * x * (Math.PI / 360));
  }
}
