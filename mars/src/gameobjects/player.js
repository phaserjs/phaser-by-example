import Step from "./step";

export default class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, oxygen = 100) {
    super(scene, x, y, "player");
    this.setOrigin(0);
    this.setScale(1);
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    this.dead = false;
    this.init();
    this.shells = 0;
    this.lastDirection = 0;
    this.steps = 0;
    this.stepDelta = 0;
    this.moveDelta = 0;
    this.rate = 0.2;
    this.previousRate = 0.2;
    this.oxygen = oxygen;
    this.locked = false;
  }

  /*
    Here we add the controls to the player and the events to update the player's position and breath.
  */
  init() {
    this.addControls();
    this.scene.events.on("update", this.update, this);
  }

  addControls() {
    this.cursor = this.scene.input.keyboard.createCursorKeys();
    this.W = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.A = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.S = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.D = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  }

  /*
    In the update function, we check the player's input and update the player's position and breath as always. But in this particular game, we move the player with a tween, so we have to check if the player is locked to avoid multiple movements at the same time.
  */
  update(time, delta) {
    if (this.dead) return;
    if (this.locked) return;
    this.stepDelta += delta;
    this.moveDelta += delta;

    if (
      (Phaser.Input.Keyboard.JustDown(this.W) ||
        Phaser.Input.Keyboard.JustDown(this.cursor.up)) &&
      this.canMoveUp()
    ) {
      this.moveDelta = 0;
      const { x, y } = this;
      this.locked = true;
      this.scene.tweens.add({
        targets: this,
        y: "-=64",
        duration: 200,
        onComplete: () => {
          this.locked = false;
        },
      });
      this.step(x, y);
    } else if (
      (Phaser.Input.Keyboard.JustDown(this.D) ||
        Phaser.Input.Keyboard.JustDown(this.cursor.right)) &&
      this.canMoveRight()
    ) {
      this.moveDelta = 0;
      const { x, y } = this;
      this.locked = true;
      this.scene.tweens.add({
        targets: this,
        x: "+=64",
        duration: 200,
        onComplete: () => {
          this.locked = false;
        },
      });
      this.step(x, y);
    } else if (
      (Phaser.Input.Keyboard.JustDown(this.A) ||
        Phaser.Input.Keyboard.JustDown(this.cursor.left)) &&
      this.canMoveLeft()
    ) {
      this.moveDelta = 0;
      const { x, y } = this;
      this.locked = true;
      this.scene.tweens.add({
        targets: this,
        x: "-=64",
        duration: 200,
        onComplete: () => {
          this.locked = false;
        },
      });
      this.step(x, y);
    } else if (
      (Phaser.Input.Keyboard.JustDown(this.S) ||
        Phaser.Input.Keyboard.JustDown(this.cursor.down)) &&
      this.canMoveDown()
    ) {
      this.moveDelta = 0;
      const { x, y } = this;
      this.locked = true;
      this.scene.tweens.add({
        targets: this,
        y: "+=64",
        duration: 200,
        onComplete: () => {
          this.locked = false;
        },
      });
      this.step(x, y);
    }

    this.adaptBreath();
  }

  /*
The next functions, lets us know if the player can move in a certain direction. We check if the tile in front of the player is empty and if the player has waited enough time to move again.
  */
  canMoveUp() {
    return (
      !this.scene.platform.getTileAtWorldXY(this.x, this.y - 1) &&
      this.moveDelta > 200
    );
  }

  canMoveRight() {
    return (
      !this.scene.platform.getTileAtWorldXY(this.x + 64, this.y) &&
      this.moveDelta > 200
    );
  }

  canMoveDown() {
    return (
      !this.scene.platform.getTileAtWorldXY(this.x, this.y + 64) &&
      this.moveDelta > 200
    );
  }

  canMoveLeft() {
    return (
      !this.scene.platform.getTileAtWorldXY(this.x - 1, this.y) &&
      this.moveDelta > 200
    );
  }

  /*
    This function adds a step to the player and creates a new step sprite in the scene. It also plays a random sound to simulate the player's steps.
  */
  step(x, y) {
    this.steps++;
    this.scene.smokeLayer.add(new Step(this.scene, x, y));
    this.scene.playRandom("step", 1);
  }

  /*
    This is another important function to add some tension. It adapts the breath of the player depending on the steps he has taken. Depending on the step rate, the player will breath faster or slower. If the player has not taken any steps, the player will breath normally. The player will also consume oxygen depending on the steps he has taken.
  */
  adaptBreath() {
    if (this.stepDelta > 2000) {
      if (this.steps > 2) {
        this.previousRate = this.rate;
        this.rate = this.steps < 11 ? this.steps / 10 : 1;
        this.scene.breath(this.rate);
        this.updateOxygen(this.steps + Math.round(this.steps / 2));
      } else if (this.rate !== this.previousRate) {
        this.previousRate = this.rate;
        this.rate = this.rate > 0.2 ? this.rate - 0.1 : 0.2;
        this.scene.breath(this.rate);
        this.scene.updateOxygen(this.steps);
      } else {
        this.scene.updateOxygen(this.steps);
      }
      this.steps = this.stepDelta = 0;
    }
  }

  /*
    As the player moves, he will consume oxygen. If the player runs out of oxygen, he will die.
  */
  updateOxygen(waste) {
    if (waste >= this.oxygen) {
      this.oxygen = 0;
      this.death();
    } else {
      this.oxygen -= waste;
    }
    this.scene.updateOxygen();
  }

  /*
    This function will be called when the player dies. It will stop the player's body and restart the scene.
  */
  death() {
    this.dead = true;
    this.body.stop();
    this.body.enable = false;
    this.scene.restartScene();
  }
}
