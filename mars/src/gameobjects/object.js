import Hole from "./hole";
import Braun from "./braun";

export default class Object extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, type, description, extra = "") {
    super(scene, x, y, 64 * 3, 64 * 3);
    this.setOrigin(0);
    this.type = type;
    this.description = description;
    this.extra = extra;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    this.activated = false;
  }

  /*
    This function decides what to do when the player touches the object, depending on its type.
    */
  touch() {
    switch (this.type) {
      case "note":
        this.showNote(this.description);
        break;
      case "radio":
        this.useRadio();
        break;
      case "exit":
        this.exitScene();
        break;
      case "hole":
        this.activateHole();
        break;
      case "oxygen":
        this.useOxygen();
        break;
      case "braun":
        this.activateBraun();
        break;
      case "ending":
        this.revealEnding();
        break;
      default:
        break;
    }
  }

  /*
    This will show a text on the screen.
  */
  showNote(note) {
    const objectText = this.scene.add.bitmapText(
      this.x,
      this.y,
      "pico",
      note,
      15
    );
    this.scene.tweens.add({
      targets: objectText,
      alpha: { from: 1, to: 0 },
      duration: 6000,
      ease: "Sine",
      onComplete: () => {
        objectText.destroy();
      },
    });
  }

  /*
This is also a text that is shown when the player reaches the exit.
  */
  showExit(note) {
    const objectText = this.scene.add.bitmapText(
      this.x - 128,
      this.y - 64,
      "pico",
      note,
      25
    );
    this.scene.tweens.add({
      targets: objectText,
      alpha: { from: 0.8, to: 1 },
      duration: 100,
      repeat: 5,
    });
  }

  /*
This function will play a random static sound:
  */
  useRadio() {
    this.officerAudio = this.scene.sound.add(this.description);
    this.officerAudio.play();
    this.officerAudio.on(
      "complete",
      function () {
        this.scene.playRandomStatic();
        if (this.extra) this.scene.sound.add(this.extra).play();
      }.bind(this)
    );
  }

  /*
When the player reaches the exit, we need to do a few things: show the exit message, play the static sound and finish the scene.
  */
  exitScene() {
    this.showExit(this.description);
    this.showNote(this.extra);
    this.scene.finishScene();
  }

  /*
Anytime the player touches the oxygen supplies, we need to show a message and refill the oxygen.
  */
  useOxygen() {
    this.showNote("Oxygen supplies!");
    this.scene.player.oxygen = 100;
    this.scene.updateOxygen();
    this.scene.playAudio("oxygen");
  }

  /*
Well, well... you can guess what happens here, right?
  */
  revealEnding() {
    const ohmy = this.scene.sound.add("ohmygod");
    ohmy.play();
    this.scene.cameras.main.shake(10000);
    this.showExit(this.description);
    this.scene.sound.add("monster").play({ volume: 1.5, rate: 0.8 });
    const monster = this.scene.add
      .sprite(this.x + 128, this.y + 128, "monster")
      .setOrigin(0.5);
    this.scene.anims.create({
      key: "monster",
      frames: this.scene.anims.generateFrameNumbers("monster", {
        start: 0,
        end: 5,
      }),
      frameRate: 3,
    });
    monster.anims.play("monster", true);
    ohmy.on(
      "complete",
      function () {
        this.scene.breathing.pause();
        this.scene.playAudio("holeshout");
        this.scene.finishScene(false);
      }.bind(this)
    );
  }

  /*
When the player touches the hole, we need to create a new hole in the scene, and the player will die.
  */
  activateHole() {
    this.scene.holes.add(new Hole(this.scene, this.x + 64, this.y + 64));
  }

  /*
So, when the player reaches a certain point, we need to activate "Braun".
  */
  activateBraun() {
    this.showExit(this.description);
    this.scene.playAudio("shock");
    new Braun(this.scene, this.x + 128, this.y + 64);
  }
}
