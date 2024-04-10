export default class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: "game_over" });
  }

  /*
    This creates the elements that we will show when the player loses the game.
  */
  create() {
    this.cameras.main.setBackgroundColor(0x000000);
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.center_width = this.width / 2;
    this.center_height = this.height / 2;
    this.introLayer = this.add.layer();
    this.splashLayer = this.add.layer();
    this.text = [
      "GAME OVER",
      "You failed to deliver the probes",
      "you survived but the mission failed!",
      "Go back to the solar system,",
      "The gulag of the dark side of the moon",
      "awaits for reeducation...",
    ];
    this.showHistory();

    this.input.keyboard.on("keydown-SPACE", this.startSplash, this);
    this.input.keyboard.on("keydown-ENTER", this.startSplash, this);
  }

  /*
    We show the history of the mission.
  */
  showHistory() {
    this.text.forEach((line, i) => {
      this.time.delayedCall(
        (i + 1) * 2000,
        () => this.showLine(line, (i + 1) * 60),
        null,
        this
      );
    });
  }

  showLine(text, y) {
    let line = this.introLayer.add(
      this.add
        .bitmapText(this.center_width, y, "computer", text, 45)
        .setTint(0x06e18a)
        .setOrigin(0.5)
        .setAlpha(0)
    );
    this.tweens.add({
      targets: line,
      duration: 2000,
      alpha: 1,
    });
  }

  /*
    This is the method that will start the Splash scene.
  */
  startSplash() {
    location.reload();
    this.scene.start("bootstrap");
  }
}
