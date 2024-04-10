import { ShotSmoke } from "../gameobjects/particle";

export default class Splash extends Phaser.Scene {
  constructor() {
    super({ key: "splash" });
  }

  /*
    This creates the elements of the Splash screen.
  */
  create() {
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.center_width = this.width / 2;
    this.center_height = this.height / 2;
    this.cameras.main.setBackgroundColor(0x000000);
    this.smokeLayer = this.add.layer();
    this.showTitle();
    this.time.delayedCall(1000, () => this.showInstructions(), null, this);

    this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);
    this.playMusic();
  }

  /*
  The title of the game is created with a delay between each letter, and the smoke effect is created simulating footsteps on the red planet.
  */
  showTitle() {
    this.step = this.sound.add("step");
    "MARSTRANDED".split("").forEach((letter, i) => {
      this.time.delayedCall(
        600 * (i + 1),
        () => {
          let text = this.add
            .bitmapText(70 * i + 50, 200, "pico", letter, 70)
            .setTint(0x6b140b)
            .setOrigin(0.5)
            .setDropShadow(0, 4, 0x6b302a, 0.9);
          Array(Phaser.Math.Between(2, 4))
            .fill(0)
            .forEach((j) => {
              this.smokeLayer.add(
                new ShotSmoke(
                  this,
                  70 * i + 80 + Phaser.Math.Between(-30, 30),
                  200 + Phaser.Math.Between(-30, 30),
                  0,
                  -1,
                  0x6b302a
                )
              );
            });
          this.step.play({ rate: 0.8 });
          this.step.resume();
        },
        null,
        this
      );
    });
  }

  /*
  This method is called when the player presses the space bar to start the game. It stops the music and starts the transition to the game.
  */
  startGame() {
    if (this.theme) this.theme.stop();
    this.sound.add("blip").play();
    this.scene.start("transition", {
      next: "game",
      name: "STAGE",
      number: 0,
      time: 30,
    });
  }

  /*
  We add some background sound instead of music, but it's a sound file looped after all.
  */
  playMusic(theme = "mars_background") {
    this.theme = this.sound.add(theme);
    this.theme.stop();
    this.theme.play({
      mute: false,
      volume: 2,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0,
    });
  }

  /*
  Below the title, we show the instructions to start the game and the author's name.
  */
  showInstructions() {
    this.add
      .bitmapText(this.center_width, 450, "pico", "WASD/Arrows", 40)
      .setTint(0x6b140b)
      .setOrigin(0.5)
      .setDropShadow(0, 3, 0x6b302a, 0.9);
    this.add
      .sprite(this.center_width - 140, 355, "pello")
      .setOrigin(0.5)
      .setScale(0.5);
    this.add
      .bitmapText(this.center_width + 60, 350, "pico", "By PELLO", 35)
      .setTint(0x6b140b)
      .setOrigin(0.5)
      .setDropShadow(0, 3, 0x6b302a, 0.9);
    this.space = this.add
      .bitmapText(this.center_width, 520, "pico", "SPACE start", 30)
      .setTint(0x6b140b)
      .setOrigin(0.5)
      .setDropShadow(0, 2, 0x6b302a, 0.9);
    this.tweens.add({
      targets: this.space,
      duration: 300,
      alpha: { from: 0, to: 1 },
      repeat: -1,
      yoyo: true,
    });
  }
}
