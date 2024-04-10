export default class Bootloader extends Phaser.Scene {
  constructor() {
    super({ key: "bootloader" });
  }

  /*
    This method loads all the assets of the game organized in different methods.
    */
  preload() {
    this.createBars();
    this.setLoadEvents();
    this.loadFonts();
    this.loadAudios();
    this.loadImages();
    this.loadSpritesheets();
    this.loadMaps();
    this.setRegistry();
  }

  /*
    This loading callback is in charge of updating the progress bar and starting the next scene when the loading is complete.
    */
  setLoadEvents() {
    this.load.on(
      "progress",
      function (value) {
        this.progressBar.clear();
        this.progressBar.fillStyle(0xa6f316, 1);
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
  }

  /*
    The fonts are loaded in this method.
    */
  loadFonts() {
    this.load.bitmapFont(
      "mario",
      "assets/fonts/mario.png",
      "assets/fonts/mario.xml"
    );
  }

  /*
    It loads the images used in the game.
    */
  loadImages() {
    this.load.image("pello", "assets/images/pello.png");
    this.load.image("background", "assets/images/background.png");
    this.load.image("tileset_fg", "assets/maps/tileset_fg.png");
    this.load.image("block_red", "assets/images/block_red.png");
    this.load.image("block_green", "assets/images/block_green.png");
    this.load.image("block_blue", "assets/images/block_blue.png");
    this.load.image("block_yellow", "assets/images/block_yellow.png");
    this.load.image("star", "assets/images/star.png");
  }

  /*
    This one loads the 9 maps of the game.
    */
  loadMaps() {
    Array(9)
      .fill(0)
      .forEach((_, i) => {
        this.load.tilemapTiledJSON(`scene${i}`, `assets/maps/scene${i}.json`);
      });
  }

  /*
    This method loads the audio files: music and sound effects.
    */
  loadAudios() {
    this.load.audio("music", "assets/sounds/music.mp3");
    this.load.audio("splash", "assets/sounds/splash.mp3");

    this.load.audio("win", "assets/sounds/win.mp3");
    this.load.audio("hover", "assets/sounds/hover.mp3");
    this.load.audio("select", "assets/sounds/select.mp3");
    this.load.audio("bump", "assets/sounds/bump.mp3");
    this.load.audio("move", "assets/sounds/move.mp3");
  }

  /*
    This method loads the sprite sheets used in the game.
    */
  loadSpritesheets() {
    this.load.spritesheet("spider", "assets/images/spider.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("heart", "assets/images/heart.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("frog", "assets/images/frog.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
    this.load.spritesheet("frog2", "assets/images/frog2.png", {
      frameWidth: 48,
      frameHeight: 32,
    });
    this.load.spritesheet("trail", "assets/images/trail.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("block", "assets/images/block.png", {
      frameWidth: 48,
      frameHeight: 48,
    });
  }

  /*
    This method sets the initial values of the game registry, to keep track of the score and the number of moves.
    */
  setRegistry() {
    this.registry.set("score", 0);
    this.registry.set("moves", 0);
  }

  /*
    This method creates the loading bars.
    */
  createBars() {
    this.loadBar = this.add.graphics();
    this.loadBar.fillStyle(0xffe066, 1);
    this.loadBar.fillRect(
      this.cameras.main.width / 4 - 2,
      this.cameras.main.height / 2 - 18,
      this.cameras.main.width / 2 + 4,
      20
    );
    this.progressBar = this.add.graphics();
  }
}
