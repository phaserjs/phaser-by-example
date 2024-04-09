export default class SeeSaw {
  constructor(scene, x, y, numTiles = 5) {
    const platform = scene.add.tileSprite(
      x,
      y,
      (32 * numTiles) / 2,
      18,
      "seesaw"
    );
    scene.matter.add.gameObject(platform, {
      restitution: 0, // No bounciness
      frictionAir: 0.2, // Spin forever without slowing down from air resistance
      friction: 0.2, // A little extra friction so the player sticks better
      // Density sets the mass and inertia based on area - 0.001 is the default. We're going lower
      // here so that the platform tips/rotates easily
      density: 0.0005,
    });

    const { Constraint } = Phaser.Physics.Matter.Matter;

    const constraint = Constraint.create({
      pointA: { x: platform.x, y: platform.y },
      bodyB: platform.body,
      length: 0,
    });

    scene.matter.world.add(constraint);
    const sign = Math.random() < 0.5 ? -1 : 1;
  }
}
