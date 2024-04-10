export default class Bootloader extends Phaser.Scene {
  constructor() {
    super({ key: "bootloader" });
  }

  preload() {
    this.createBars();
    this.load.on(
      "progress",
      function (value) {
        this.progressBar.clear();
        this.progressBar.fillStyle(0x88d24c, 1);
        this.progressBar.fillRect(
          this.cameras.main.width / 4,
          this.cameras.main.height / 2 - 16,
          (this.cameras.main.width / 2) * value,
          16
        );
      },
      this
    );
    this.load.on(
      "complete",
      () => {
        this.scene.start("game");
      },
      this
    );

    Array(6)
      .fill(0)
      .forEach((_, i) => {
        this.load.audio(`muzik${i}`, `assets/sounds/muzik${i}.mp3`);
      });

    this.load.image("ship1_1", "assets/images/starship.png");
    this.load.image("foeship", "assets/images/foeship.png");
    this.load.image("pello", "assets/images/pello.png");
    this.load.image("hex", "assets/images/hex64.png");
    this.load.image("asteroid", "assets/images/asteroid.png");
    this.load.audio("splash", "assets/sounds/splash.mp3");
    this.load.audio("game-over", "assets/sounds/game-over.mp3");
    this.load.audio("explosion", "assets/sounds/explosion.mp3");
    this.load.audio("shot", "assets/sounds/shot.mp3");
    this.load.audio("foeshot", "assets/sounds/foeshot.mp3");
    this.load.audio("pick", "assets/sounds/pick.mp3");
    this.load.audio("asteroid", "assets/sounds/asteroid.mp3");

    this.load.bitmapFont(
      "arcade",
      "assets/fonts/arcade.png",
      "assets/fonts/arcade.xml"
    );
    this.load.bitmapFont(
      "wendy",
      "assets/fonts/arcade.png",
      "assets/fonts/wendy.xml"
    );
    this.load.bitmapFont(
      "starshipped",
      "assets/fonts/starshipped.png",
      "assets/fonts/starshipped.xml"
    );
    this.load.spritesheet("shot", "assets/images/shot.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("shotfoe", "assets/images/shotfoe.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("energy", "assets/images/energy.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {}

  createBars() {
    this.loadBar = this.add.graphics();
    this.loadBar.fillStyle(0x008483, 1);
    this.loadBar.fillRect(
      this.cameras.main.width / 4 - 2,
      this.cameras.main.height / 2 - 18,
      this.cameras.main.width / 2 + 4,
      20
    );
    this.progressBar = this.add.graphics();
  }
}
