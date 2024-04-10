export class MatterGravityFixPlugin extends Phaser.Plugins.ScenePlugin {
  constructor(scene, pluginManager) {
    super(scene, pluginManager);
  }
  boot() {
    const Matter = Phaser.Physics.Matter.Matter;
    this.applyGravityFix(Matter);
  }

  /*
    This does the trick to fix the gravity issue. It overrides the _bodiesApplyGravity function in the `Matter.Engine` class.
  */
  applyGravityFix(Matter) {
    Matter.Engine._bodiesApplyGravity = function (bodies, gravity) {
      var gravityScale =
          typeof gravity.scale !== "undefined" ? gravity.scale : 0.001,
        bodiesLength = bodies.length;

      if ((gravity.x === 0 && gravity.y === 0) || gravityScale === 0) {
        return;
      }

      for (var i = 0; i < bodiesLength; i++) {
        var body = bodies[i];

        if (body.ignoreGravity || body.isStatic || body.isSleeping) {
          continue;
        }
        body.force.y += body.mass * gravity.y * gravityScale;
        body.force.x += body.mass * gravity.x * gravityScale;
      }
    };
  }
}
