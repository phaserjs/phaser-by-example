import EasyStar from "easystarjs";

export default class Drone extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, grid) {
    super(scene, x, y, "drone");
    this.name = "drone";
    this.setScale(1);
    this.grid = grid;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    this.easystar = new EasyStar.js();
    this.init();
  }

  /*
  Here we have to pay attention to the fact that we are using the EasyStar library to calculate the path of the drone: we have to set the grid and the acceptable tiles for the pathfinding algorithm. We also have to set the animation of the drone and the event that will trigger the movement of the drone. When it starts moving it will also reproduce the sound of the drone.
  */
  init() {
    this.easystar.setGrid(this.grid);
    this.easystar.setAcceptableTiles([0]);
    this.scene.events.on("update", this.update, this);
    this.scene.tweens.add({
      targets: this,
      duration: 500,
      repeat: -1,
      scale: { from: 0.95, to: 1 },
      yoyo: true,
    });

    this.scene.anims.create({
      key: this.name,
      frames: this.scene.anims.generateFrameNumbers(this.name, {
        start: 0,
        end: 3,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.play(this.name, true);
    this.flipX = this.direction < 0;

    this.scene.time.delayedCall(
      Phaser.Math.Between(3000, 5000),
      () => {
        this.scene.playAudio("kill");
        this.launchMove();
      },
      null,
      this
    );
  }

  /*
    This starts the movement of the drone:
  */
  launchMove() {
    if (!this.scene) return;
    this.delayedMove = this.scene.time.addEvent({
      delay: 2000, // ms
      callback: this.move.bind(this),
      startAt: 0,
      callbackScope: this,
      loop: true,
    });
  }

  /*
    This function uses EasyStar to calculate the path and then we will call a function to move the drone.
  */
  move() {
    try {
      if (!this.scene.player) return;
      if (this.moveTimeline) this.moveTimeline.destroy();

      this.easystar.findPath(
        Math.floor(this.x / 64),
        Math.floor(this.y / 64),
        Math.floor(this.scene.player.x / 64),
        Math.floor(this.scene.player.y / 64),
        this.moveIt.bind(this)
      );
      this.easystar.setIterationsPerCalculation(10000);
      this.easystar.enableSync();
      this.easystar.calculate();
    } catch (err) {
      console.log("Cant move yet: ", err);
    }
  }

  /*
  And finally, this function will move the drone to the calculated path. At the end of the path, it will call the launchMove function again, so the drone can recalculate the path even if the player changes her position.
  */
  moveIt(path) {
    if (path === null) {
      console.log("hello sneaky pete");
    } else {
      let tweens = [];
      this.i = 0;
      this.path = path;
      for (let i = 0; i < path.length - 1; i++) {
        if (this.scene.player.dead) return;
        let ex = path[i + 1].x * 64;
        let ey = path[i + 1].y * 64;
        tweens.push({
          targets: this,
          duration: 400,
          x: ex,
          y: ey,
        });
      }

      this.moveTimeline = this.scene.add.timeline({
        tweens: tweens,
        onComplete: () => {
          this.delayedMove.remove();
          if (this.alpha > 0 && !this.scene.player.dead) this.launchMove();
        },
      });
    }
  }
}
