export default class Transition extends Phaser.Scene {
  constructor() {
    super({ key: "transition" });
  }

  init(data) {
    this.name = data.name;
    this.number = data.number;
    this.next = data.next;
  }

  /*
    This creates the elements of the transition screen.
    */
  create() {
    const messages = ["TUTORIAL", "STAGE 1", "STAGE 2", "STAGE 3", "STAGE 4"];
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.center_width = this.width / 2;
    this.center_height = this.height / 2;

    if (this.number === 5) this.loadOutro();

    this.addScore();

    this.add.sprite(this.center_width, this.center_height - 170, "walt");
    this.add
      .bitmapText(
        this.center_width,
        this.center_height - 20,
        "pixelFont",
        messages[this.number],
        40
      )
      .setOrigin(0.5);
    this.add
      .bitmapText(
        this.center_width,
        this.center_height + 20,
        "pixelFont",
        "Ready?",
        30
      )
      .setOrigin(0.5);
    this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
    this.input.keyboard.on("keydown-SPACE", () => this.loadNext(), this);
    this.time.delayedCall(
      3000,
      () => {
        this.loadNext();
      },
      null,
      this
    );
  }

  /*
    These functions are used to load the next scene
    */
  loadNext() {
    this.scene.start("game", { name: this.name, number: this.number });
  }

  loadOutro() {
    this.scene.start("outro", { name: this.name, number: this.number });
  }

  /*
    Helper function to show the score and coins
    */
  addScore() {
    this.scoreCoins = this.add
      .bitmapText(
        this.center_width + 32,
        this.center_height - 100,
        "pixelFont",
        "x" + this.registry.get("coins"),
        30
      )
      .setDropShadow(0, 4, 0x222222, 0.9)
      .setOrigin(0.5)
      .setScrollFactor(0);
    this.scoreCoinsLogo = this.add
      .sprite(this.center_width - 32, this.center_height - 100, "coin")
      .setScale(0.7)
      .setOrigin(0.5)
      .setScrollFactor(0);
    const coinAnimation = this.anims.create({
      key: "coinscore",
      frames: this.anims.generateFrameNumbers("coin", { start: 0, end: 7 }),
      frameRate: 8,
    });
    this.scoreCoinsLogo.play({ key: "coinscore", repeat: -1 });
  }
}
