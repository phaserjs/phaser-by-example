import Shot from "./shot";

export default class ShootingPatterns {
  constructor(scene, name) {
    this.scene = scene;
    this.name = name;
    this.shootingMethods = {
      water: this.single.bind(this),
      fruit: this.tri.bind(this),
      vanila: this.quintus.bind(this),
      chocolate: this.massacre.bind(this),
    };
  }

  /*
    These are the different functions we will use to shoot. Each one will shoot a different number of shots, with different angles and speeds.
    The patterns are applied depending on the current power-up.
    */
  shoot(x, y, powerUp) {
    this.shootingMethods[powerUp](x, y, powerUp);
  }

  single(x, y, powerUp) {
    this.scene.shots.add(new Shot(this.scene, x, y, powerUp, this.name));
  }

  tri(x, y, powerUp) {
    this.scene.shots.add(new Shot(this.scene, x, y, powerUp, this.name, -60));
    this.scene.shots.add(new Shot(this.scene, x, y, powerUp, this.name));
    this.scene.shots.add(new Shot(this.scene, x, y, powerUp, this.name, 60));
  }

  quintus(x, y, powerUp) {
    this.scene.shots.add(new Shot(this.scene, x, y, powerUp, this.name, -300));
    this.scene.shots.add(new Shot(this.scene, x, y, powerUp, this.name, 300));
    this.scene.shots.add(
      new Shot(this.scene, x, y, powerUp, this.name, -300, 500)
    );
    this.scene.shots.add(
      new Shot(this.scene, x, y, powerUp, this.name, 300, 500)
    );
  }

  massacre(x, y, powerUp) {
    this.scene.shots.add(
      new Shot(this.scene, x, y, powerUp, this.name, 300, 0)
    );
    this.scene.shots.add(
      new Shot(this.scene, x, y, powerUp, this.name, -300, 0)
    );
    this.scene.shots.add(
      new Shot(this.scene, x, y, powerUp, this.name, 0, 500)
    );
    this.scene.shots.add(new Shot(this.scene, x, y, powerUp, this.name, 30));
    this.scene.shots.add(new Shot(this.scene, x, y, powerUp, this.name, 60));
  }
}
