export default class Transition extends Phaser.Scene {
  constructor() {
    super({ key: "transition" });
  }

  /*
In this short transition before the game, we show the instructions and the keys to press to start the game. This scene becomes the prelude right before the game to make the player ready.
  */
  create() {
    this.sound.stopAll();
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.center_width = this.width / 2;
    this.center_height = this.height / 2;
    this.sound.add("start").play();
    this.playMusic();
    this.key = this.add
      .sprite(this.center_width, this.center_height - 120, "keys", 0)
      .setOrigin(0.5)
      .setScale(2);

    this.add
      .bitmapText(
        this.center_width,
        this.center_height - 20,
        "default",
        "GET ALL KEYS",
        30
      )
      .setOrigin(0.5);
    this.add
      .bitmapText(
        this.center_width,
        this.center_height + 40,
        "default",
        "from all rooms!",
        25
      )
      .setOrigin(0.5);
    this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
    this.input.keyboard.on("keydown-SPACE", () => this.loadNext(), this);
    this.time.delayedCall(1000, () => this.loadNext(), null, this);
  }

  loadNext() {
    this.scene.start("game");
  }

  /*
We play the music in a loop from the transition. This way the music doesn't stop when the player goes to the game and it dies. Once the player is in the game scene, if it dies he will be respawned in that scene and this music should continue playing, so it will not stop and start all the time.
  */
  playMusic(theme = "music") {
    this.theme = this.sound.add(theme);
    this.theme.stop();
    this.theme.play({
      mute: false,
      volume: 0.2,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0,
    });
  }
}
