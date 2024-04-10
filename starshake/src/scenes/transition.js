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
    In the transition, we show a message with the current stage and some advice, and then we load the next scene.
    */
  create() {
    const messages = [
      "Fire at will",
      "Beware the tanks",
      "Shoot down the UFOs",
      "FINAL BOSS",
    ];

    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.center_width = this.width / 2;
    this.center_height = this.height / 2;
    this.sound.add("stageclear2").play();
    this.add
      .bitmapText(
        this.center_width,
        this.center_height - 50,
        "wendy",
        messages[this.number - 1],
        100
      )
      .setOrigin(0.5);
    this.add
      .bitmapText(
        this.center_width,
        this.center_height + 50,
        "wendy",
        "Ready player 1",
        80
      )
      .setOrigin(0.5);

    this.playMusic("music" + (this.number !== 4 ? this.number : 1));
    this.time.delayedCall(2000, () => this.loadNext(), null, this);
  }

  loadNext() {
    this.scene.start(this.next, {
      name: this.name,
      number: this.number,
      time: this.time,
    });
  }

  /*
    The music of the stage is loaded and played in this transition.
    */
  playMusic(theme = "music1") {
    this.theme = this.sound.add(theme);
    this.theme.play({
      mute: false,
      volume: 0.4,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0,
    });
  }
}
