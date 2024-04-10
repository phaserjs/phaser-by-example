export default class Transition extends Phaser.Scene {
  constructor() {
    super({ key: "transition" });
  }

  init(data) {
    this.name = data.name;
    this.number = data.number;
  }

  /*
    We just show the name of the stage and the word "Ready?". If the stage is the last one, we start the outro scene.
  */
  create() {
    const messages = [
      "Tutorial",
      "Stage0",
      "Stage1",
      "Stage2",
      "Stage3",
      "Stage4",
      "Stage5",
      "Stage6",
      "Stage7",
      "Outro",
    ];

    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.center_width = this.width / 2;
    this.center_height = this.height / 2;
    this.cameras.main.setBackgroundColor(0x3c97a6);

    if (this.number === 9) {
      this.scene.start("outro", { name: this.name, number: this.number });
    }

    this.add
      .bitmapText(
        this.center_width,
        this.center_height - 20,
        "mario",
        messages[this.number],
        40
      )
      .setOrigin(0.5)
      .setTint(0xa6f316)
      .setDropShadow(2, 3, 0x75b947, 0.7);
    this.add
      .bitmapText(
        this.center_width,
        this.center_height + 20,
        "mario",
        "Ready?",
        30
      )
      .setOrigin(0.5)
      .setTint(0xa6f316)
      .setDropShadow(2, 3, 0x75b947, 0.7);
    this.time.delayedCall(1000, () => this.loadNext(), null, this);
  }

  loadNext() {
    this.scene.start("game", {
      name: this.name,
      number: this.number,
      limitedTime: 10 + this.number * 3,
    });
  }
}
