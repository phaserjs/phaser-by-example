export default class Outro extends Phaser.Scene {
  constructor() {
    super({ key: "outro" });
  }

  init(data) {
    this.name = data.name;
    this.number = data.number;
    this.next = data.next;
  }

  /*
First, we add all elements to the scene: player image, score, text, and the input to restart the game.
  */
  create() {
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.center_width = this.width / 2;
    this.center_height = this.height / 2;
    this.showPlayer();
    this.sound.add("win").play();
    this.scoreCoins = this.add
      .bitmapText(
        this.center_width,
        50,
        "default",
        "Coins: " + this.registry.get("coins"),
        25
      )
      .setOrigin(0.5)
      .setScrollFactor(0);
    this.scoreSeconds = this.add
      .bitmapText(
        this.center_width,
        100,
        "default",
        "Time: " + this.registry.get("seconds"),
        25
      )
      .setOrigin(0.5)
      .setScrollFactor(0);
    this.add
      .bitmapText(
        this.center_width,
        this.center_height - 20,
        "default",
        "YOU DID IT!!",
        40
      )
      .setOrigin(0.5);
    this.add
      .bitmapText(
        this.center_width,
        this.center_height + 40,
        "default",
        "Press space to restart",
        25
      )
      .setOrigin(0.5);
    this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
    this.input.keyboard.on("keydown-SPACE", () => this.loadNext(), this);
  }

  loadNext() {
    this.scene.start("splash");
  }

  /*
    We show the player image and play the idle animation.
  */
  showPlayer() {
    this.player = this.add
      .sprite(this.center_width, this.center_height - 120, "player")
      .setOrigin(0.5)
      .setScale(3);
    this.anims.create({
      key: "playeridle",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 1 }),
      frameRate: 5,
      repeat: -1,
    });

    this.player.anims.play("playeridle");
  }
}
