export default class Bootloader extends Phaser.Scene {
  constructor() {
    super({ key: "bootloader" });
  }

  /*
    Once again we load all the assets in the preload method, organizing them in the usual order and starting from the progress bar.
    */
  preload() {
    this.createBars();
    this.setLoadEvents();
    this.loadFonts();
    this.loadImages();
    this.loadMaps();
    this.loadAudios();
    this.loadSpritesheets();
    this.setRegistry();
  }

  /*
    This will be the method that will be in charge of updating the progress bar as the assets are loaded. The colors used in the bar are the same that we use in the game and the splash screen.
    */
  setLoadEvents() {
    this.load.on(
      "progress",
      function (value) {
        this.progressBar.clear();
        this.progressBar.fillStyle(0xae2012, 1);
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
    In this game, there's only one minimalistic, computer-like font, so we only need to load one bitmap font.
    */
  loadFonts() {
    this.load.bitmapFont(
      "pico",
      "assets/fonts/pico.png",
      "assets/fonts/pico.xml"
    );
  }

  /*
    These are the fixed images of the game. A couple of them are backgrounds used in the game transitions.
    */
  loadImages() {
    this.load.image("body", "assets/images/body.png");
    this.load.image("landscape", "assets/images/landscape.png");
    this.load.image("record", "assets/images/record.png");
    this.load.image("hole", "assets/images/hole.png");
    this.load.image("pello", "assets/images/pello_ok.png");
    this.load.image("mars", "assets/maps/mars64.png");
    this.load.image("background", "assets/maps/mars.png");
  }

  /*
    This game contains different tiled maps. As the game advances, the style will change slightly, with a more complex and darker style at the end.
    */
  loadMaps() {
    Array(7)
      .fill(0)
      .forEach((_, i) => {
        this.load.tilemapTiledJSON(`scene${i}`, `assets/maps/scene${i}.json`);
      });
  }

  /*
    There are many audios in this game because we need to create a very immersive atmosphere and we require sound recordings for the diaries and the officer's messages.
    */
  loadAudios() {
    this.load.audio("mars_background", "assets/sounds/mars_background.mp3");
    this.load.audio("step", "assets/sounds/step.mp3");
    this.load.audio("creepy", "assets/sounds/creepy.mp3");
    this.load.audio("heartbeat", "assets/sounds/heartbeat.mp3");
    this.load.audio("breath", "assets/sounds/breath.mp3");
    this.load.audio("blip", "assets/sounds/blip.mp3");
    this.load.audio("ohmygod", "assets/sounds/ohmygod.mp3");
    this.load.audio("kill", "assets/sounds/kill.mp3");
    this.load.audio("tracker", "assets/sounds/tracker.mp3");
    this.load.audio("holeshout", "assets/sounds/holeshout.mp3");
    this.load.audio("oxygen", "assets/sounds/oxygen.mp3");
    this.load.audio("monster", "assets/sounds/monster.mp3");
    this.load.audio("killed", "assets/sounds/killed.mp3");
    this.load.audio("creepy_static", "assets/sounds/creepy_static.mp3");
    this.load.audio("shock", "assets/sounds/shock.mp3");
    this.load.audio("cave", "assets/sounds/cave.mp3");
    this.load.audio("type", "assets/sounds/type.mp3");

    Array(4)
      .fill(0)
      .forEach((_, i) => {
        this.load.audio(`static${i}`, `assets/sounds/static${i}.mp3`);
      });

    Array(6)
      .fill(0)
      .forEach((_, i) => {
        this.load.audio(
          `diary${i + 1}`,
          `assets/sounds/diary/diary${i + 1}.mp3`
        );
      });

    Array(6)
      .fill(0)
      .forEach((_, i) => {
        this.load.audio(
          `officer${i + 1}`,
          `assets/sounds/officer/officer${i + 1}.mp3`
        );
      });
  }

  /*
    These are the sprites, not many because of the style of the game. Uh-oh, there's a monster!
    */
  loadSpritesheets() {
    this.load.spritesheet("player", "assets/images/player.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("debris", "assets/images/debris.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("step", "assets/images/step.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("wave", "assets/images/wave.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("drone", "assets/images/drone.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("monster", "assets/images/monster.png", {
      frameWidth: 128,
      frameHeight: 64,
    });
  }

  /*
    This method will set the initial value of the game's registry. The score will be set to 0. We could use it to measure completion time or the steps required.
    */
  setRegistry() {
    this.registry.set("score", 0);
  }

  /*
    This is the background of the progress bar. It's a simple rectangle with a border and it also uses one of the game's colors.
    */
  createBars() {
    this.loadBar = this.add.graphics();
    this.loadBar.fillStyle(0x6b140b, 1);
    this.loadBar.fillRect(
      this.cameras.main.width / 4 - 2,
      this.cameras.main.height / 2 - 18,
      this.cameras.main.width / 2 + 4,
      20
    );
    this.progressBar = this.add.graphics();
  }
}
