import { Debris } from "../gameobjects/particle";

export default class Splash extends Phaser.Scene {
  constructor() {
    super({ key: "splash" });
  }

  create() {
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.center_width = this.width / 2;
    this.center_height = this.height / 2;

    this.cameras.main.setBackgroundColor(0x000000);
    this.time.delayedCall(1000, () => this.showInstructions(), null, this);

    this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);
    this.input.keyboard.on("keydown-ENTER", () => this.startGame(), this);
    this.playMusic();
    this.showTitle();
    this.playAudioRandomly("stone");
  }

  startGame() {
    if (this.theme) this.theme.stop();
    this.scene.start("transition", {
      next: "game",
      name: "STAGE",
      number: 0,
      time: 30,
    });
  }

  /*
    Helper function to show the title letter by letter
    */
  showTitle() {
    "WALL".split("").forEach((letter, i) => {
      this.time.delayedCall(
        200 * (i + 1),
        () => {
          this.playAudioRandomly("stone_fail");

          if (Phaser.Math.Between(0, 5) > 2) this.playAudioRandomly("stone");
          let text = this.add
            .bitmapText(130 * (i + 1) + 140, 200, "hammerfont", letter, 170)
            .setTint(0xca6702)
            .setOrigin(0.5)
            .setDropShadow(4, 6, 0xf09937, 0.9);
          Array(Phaser.Math.Between(4, 6))
            .fill(0)
            .forEach((i) => new Debris(this, text.x, text.y, 0xca6702));
        },
        null,
        this
      );
    });

    "HAMMER".split("").forEach((letter, i) => {
      this.time.delayedCall(
        200 * (i + 1) + 800,
        () => {
          this.playAudioRandomly("stone_fail");
          if (Phaser.Math.Between(0, 5) > 2) this.playAudioRandomly("stone");
          let text = this.add
            .bitmapText(130 * (i + 1), 350, "hammerfont", letter, 170)
            .setTint(0xca6702)
            .setOrigin(0.5)
            .setDropShadow(4, 6, 0xf09937, 0.9);
          Array(Phaser.Math.Between(4, 6))
            .fill(0)
            .forEach((i) => new Debris(this, text.x, text.y, 0xca6702));
        },
        null,
        this
      );
    });
  }

  /*
    Helper function to play audio randomly to add variety.
    */
  playAudioRandomly(key) {
    const volume = Phaser.Math.Between(0.8, 1);
    const rate = 1;
    this.sound.add(key).play({ volume, rate });
  }

  playMusic(theme = "splash") {
    this.theme = this.sound.add(theme);
    this.theme.stop();
    this.theme.play({
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0,
    });
  }

  /*
    Generates the instructions text for the player.
    */
  showInstructions() {
    this.add
      .bitmapText(this.center_width, 450, "pixelFont", "WASD/Arrows: move", 30)
      .setOrigin(0.5);
    this.add
      .bitmapText(this.center_width, 500, "pixelFont", "S/DOWN: BUILD WALL", 30)
      .setOrigin(0.5);
    this.add
      .bitmapText(this.center_width, 550, "pixelFont", "SPACE: HAMMER", 30)
      .setOrigin(0.5);
    this.add
      .sprite(this.center_width - 120, 620, "pello")
      .setOrigin(0.5)
      .setScale(0.3);
    this.add
      .bitmapText(this.center_width + 40, 620, "pixelFont", "By PELLO", 15)
      .setOrigin(0.5);
    this.space = this.add
      .bitmapText(
        this.center_width,
        670,
        "pixelFont",
        "Press SPACE to start",
        30
      )
      .setOrigin(0.5);
    this.tweens.add({
      targets: this.space,
      duration: 300,
      alpha: { from: 0, to: 1 },
      repeat: -1,
      yoyo: true,
    });
  }
}
