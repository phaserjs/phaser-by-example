export default class Outro extends Phaser.Scene {
  constructor() {
    super({ key: "outro" });
  }

  /*
    This scene will show some text
    */
  create() {
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.center_width = this.width / 2;
    this.center_height = this.height / 2;
    this.introLayer = this.add.layer();
    this.splashLayer = this.add.layer();
    this.text = [
      "You did it!!",
      "Thanks to your building skills",
      "and your mighty hammer,",
      "you saved the earth.",
      "Made in 3 days for Minijam",
      "by Pello",
      "",
      "Press SPACE",
    ];
    this.showHistory();

    this.input.keyboard.on("keydown-SPACE", this.startSplash, this);
    this.input.keyboard.on("keydown-ENTER", this.startSplash, this);
  }

  startSplash() {
    this.scene.start("splash");
  }

  /*
    Helper function to show the text line by line
    */
  showHistory() {
    this.text.forEach((line, i) => {
      this.time.delayedCall(
        (i + 1) * 2000,
        () => this.showLine(line, (i + 1) * 70),
        null,
        this
      );
    });
  }

  showLine(text, y) {
    let line = this.introLayer.add(
      this.add
        .bitmapText(this.center_width, y, "pixelFont", text, 25)
        .setOrigin(0.5)
        .setAlpha(0)
    );
    this.tweens.add({
      targets: line,
      duration: 2000,
      alpha: 1,
    });
  }
}
