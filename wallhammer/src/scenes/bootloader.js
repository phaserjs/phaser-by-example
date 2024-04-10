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
        this.progressBar.fillStyle(0xf09937, 1);
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
        this.scene.start("splash");
      },
      this
    );

    Array(5)
      .fill(0)
      .forEach((_, i) => {
        this.load.audio(`music${i}`, `assets/sounds/music${i}.mp3`);
      });

    this.load.image("pello", "assets/images/pello.png");
    this.load.image("landscape", "assets/images/landscape.png");

    this.load.audio("build", "assets/sounds/build.mp3");
    this.load.audio("coin", "assets/sounds/coin.mp3");
    this.load.audio("death", "assets/sounds/death.mp3");
    this.load.audio("jump", "assets/sounds/jump.mp3");
    this.load.audio("kill", "assets/sounds/kill.mp3");
    this.load.audio("land", "assets/sounds/land.mp3");
    this.load.audio("lunchbox", "assets/sounds/lunchbox.mp3");
    this.load.audio("prize", "assets/sounds/prize.mp3");
    this.load.audio("stone_fail", "assets/sounds/stone_fail.mp3");
    this.load.audio("stone", "assets/sounds/stone.mp3");
    this.load.audio("foedeath", "assets/sounds/foedeath.mp3");
    this.load.audio("stage", "assets/sounds/stage.mp3");

    this.load.audio("splash", "assets/sounds/splash.mp3");

    Array(2)
      .fill(0)
      .forEach((_, i) => {
        this.load.image(`brick${i}`, `assets/images/brick${i}.png`);
      });

    Array(5)
      .fill(0)
      .forEach((_, i) => {
        this.load.image(
          `platform${i + 2}`,
          `assets/images/platform${i + 2}.png`
        );
      });

    this.load.bitmapFont(
      "pixelFont",
      "assets/fonts/mario.png",
      "assets/fonts/mario.xml"
    );
    this.load.spritesheet("walt", "assets/images/walt.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    Array(5)
      .fill(0)
      .forEach((_, i) => {
        this.load.tilemapTiledJSON(`scene${i}`, `assets/maps/scene${i}.json`);
      });
    this.load.image("softbricks", "assets/maps/softbricks.png");
    this.load.image("bricks", "assets/maps/bricks.png");
    this.load.image("background", "assets/maps/background.png");

    this.load.image("chain", "assets/images/chain.png");
    this.load.spritesheet("bat", "assets/images/bat.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("zombie", "assets/images/zombie.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("coin", "assets/images/coin.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("lunchbox", "assets/images/lunchbox.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("hammer", "assets/images/hammer.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("speed", "assets/images/speed.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("boots", "assets/images/boots.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("star", "assets/images/star.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.bitmapFont(
      "hammerfont",
      "assets/fonts/hammer.png",
      "assets/fonts/hammer.xml"
    );
    this.registry.set("score", 0);
    this.registry.set("coins", 0);
  }

  createBars() {
    this.loadBar = this.add.graphics();
    this.loadBar.fillStyle(0xca6702, 1);
    this.loadBar.fillRect(
      this.cameras.main.width / 4 - 2,
      this.cameras.main.height / 2 - 18,
      this.cameras.main.width / 2 + 4,
      20
    );
    this.progressBar = this.add.graphics();
  }
}
