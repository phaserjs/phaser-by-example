import Bat from "./bat";
import Wizard from "./wizard";

export default class Bubble extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, offset, options = { isStatic: true }) {
    super(scene.matter.world, x + offset, y, "bubble", 0, options);
    this.offset = offset;
    this.setFriction(1, 0, Infinity);
    this.startX = x;
    this.startY = y;
    this.scene = scene;
    scene.add.existing(this);
    this.moveVertically();
    this.scene.events.on("update", this.update, this);
  }

  /*
    This function loads the sprite that will be inside the bubble. It also creates a tween to make it rotate.
  */
  load(sprite) {
    this.scene.playAudio("trap");
    this.loaded = this.scene.add
      .sprite(this.x, this.y, sprite)
      .setOrigin(0.5)
      .setScale(0.6);
    this.loaded.name = sprite;
    this.loadedTween = this.scene.tweens.add({
      targets: this.loaded,
      rotation: "+=5",
      yoyo: true,
      repeat: -1,
    });
  }

  /*
    This method moves the bubble horizontally. It happens when the bubble is launched.
  */
  moveHorizontally() {
    this.scene.tweens.add({
      targets: this,
      scaleX: { from: 1, to: 0.9 },
      yoyo: true,
      repeat: -1,
      duration: 200,
    });
    this.scene.tweens.addCounter({
      from: 0,
      to: Phaser.Math.Between(-400, 400),
      duration: 3500,
      ease: Phaser.Math.Easing.Sine.InOut,
      onUpdate: (tween, target) => {
        const x = this.startX + target.value;
        const dx = x - this.x;
        this.x = x;
        this.setVelocityX(dx);
      },
      onComplete: () => {
        this.scene.time.delayedCall(
          1000,
          () => {
            this.destroy();
          },
          null,
          this
        );
      },
    });
  }

  /*
    This one moves the bubble vertically. It moves the bubble with a tween and then it destroys it.
  */
  moveVertically() {
    this.blob = this.scene.tweens.add({
      targets: this,
      scaleX: { from: 1, to: 0.9 },
      yoyo: true,
      repeat: -1,
      duration: 200,
    });
    this.scene.tweens.addCounter({
      from: 0,
      to: -300,
      duration: 4500,
      ease: Phaser.Math.Easing.Sine.InOut,
      onUpdate: (tween, target) => {
        const y = this.startY + target.value;
        const dy = y - this.y;
        this.y = y;
        this.setVelocityY(dy);
      },
      onComplete: () => {
        this.blob.destroy();
        this.scene.time.delayedCall(
          1000,
          () => {
            this.destroy();
          },
          null,
          this
        );
      },
    });
  }

  /*
    When a bubble is destroyed, we respawn the sprite that was inside it, setting it free.
  */
  respawn() {
    this.loadedTween.destroy();
    if (this.loaded.name === "wizard") {
      new Wizard(this.scene, this.x, this.y);
    } else if (this.loaded.name === "bat") {
      new Bat(this.scene, this.x, this.y);
    }
    this.loaded.destroy();
    this.loaded = null;
  }

  /*
    We update the position of the sprite that was inside the bubble.
  */
  update() {
    if (!this.active) return;
    if (this.loaded) {
      this.loaded.x = this.x;
      this.loaded.y = this.y;
    }
  }

  /*
    This is called when the bubble is destroyed. We play the crash sound and respawn the sprite that was inside it and finally we actually destroy the bubble game object.
  */
  destroy() {
    if (!this.scene) return;
    this.scene.playAudio("crash");
    if (this.loaded) this.respawn();
    super.destroy();
  }
}
