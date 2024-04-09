export default class Outro extends Phaser.Scene {
  constructor() {
    super({ key: "outro" });
  }

  /*
This outro is shown when the player wins the game. It just shows a few lines of text and then it starts the game again.
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
      "This feels like falling",
      "and collapsing at the same time...",
      "I'm glad that I succeded",
      "By the way...",
      "I see no god inside here.",
    ];
    this.showHistory();
    this.input.keyboard.on("keydown-SPACE", this.startAgain, this);
    this.input.keyboard.on("keydown-ENTER", this.startAgain, this);
  }

  startAgain() {
    this.scene.start("bootstrap");
  }

  /*
    We use again this function to show the text line by line.
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
        .bitmapText(this.center_width, y, "computer", text, 35)
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
