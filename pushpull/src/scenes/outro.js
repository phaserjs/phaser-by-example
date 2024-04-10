export default class Outro extends Phaser.Scene {
  constructor() {
    super({ key: "outro" });
  }

  create() {
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.center_width = this.width / 2;
    this.center_height = this.height / 2;
    this.introLayer = this.add.layer();
    this.cameras.main.setBackgroundColor(0x3c97a6);
    this.splashLayer = this.add.layer();

    this.showCount();

    this.addStartButton();
    this.input.keyboard.on("keydown-SPACE", this.startSplash, this);
    this.input.keyboard.on("keydown-ENTER", this.startSplash, this);
  }

  /*
    This will show the total moves during the game.
  */
  showCount() {
    this.winText = this.add
      .bitmapText(
        this.center_width,
        -100,
        "mario",
        "TOTAL MOVES: " + this.registry.get("moves"),
        30
      )
      .setOrigin(0.5)
      .setTint(0xffe066)
      .setDropShadow(2, 3, 0x75b947, 0.7);
    this.tweens.add({
      targets: this.winText,
      duration: 500,
      y: { from: this.winText.y, to: this.center_height },
    });
    this.tweens.add({
      targets: this.winText,
      duration: 100,
      scale: { from: 1, to: 1.1 },
      repeat: -1,
      yoyo: true,
    });
  }

  /*
    This adds a start button that can be clicked with the mouse or touched with a finger.
  */
  addStartButton() {
    this.startButton = this.add
      .bitmapText(this.center_width, 500, "mario", "Click to start", 30)
      .setOrigin(0.5)
      .setTint(0x9a5000)
      .setDropShadow(2, 3, 0x693600, 0.7);
    this.startButton.setInteractive();
    this.startButton.on("pointerdown", () => {
      this.startSplash();
    });

    this.startButton.on("pointerover", () => {
      this.startButton.setTint(0x3e6875);
    });

    this.startButton.on("pointerout", () => {
      this.startButton.setTint(0xffffff);
    });

    this.tweens.add({
      targets: this.space,
      duration: 300,
      alpha: { from: 0, to: 1 },
      repeat: -1,
      yoyo: true,
    });
  }

  /*
    This starts the splash scene.
  */
  startSplash() {
    this.sound.stopAll();
    this.scene.start("splash");
  }
}
