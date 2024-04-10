export default class Splash extends Phaser.Scene {
  constructor() {
    super({ key: "splash" });
  }

  /*
    We create the elements of the splash scene: the background, the title, the start button, and the instructions.
  */
  create() {
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.center_width = this.width / 2;
    this.center_height = this.height / 2;
    this.background = this.add
      .tileSprite(0, 0, 1024, 1024, "background")
      .setOrigin(0);

    this.cameras.main.setBackgroundColor(0x3c97a6);

    this.time.delayedCall(1000, () => this.showInstructions(), null, this);
    this.addStartButton();
    this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);
    this.playMusic();

    this.showTitle();
    this.addStartButton();
  }

  /*
    We use the game loops to animate the background.
  */
  update() {
    this.background.tilePositionX += 1;
    this.background.tilePositionY += 1;
  }

  /*
    When the game starts, we stop the music and start the transition scene with a new music file.
  */
  startGame() {
    if (this.theme) this.theme.stop();
    this.playGameMusic();
    this.scene.start("transition", { name: "STAGE", number: 0 });
  }

  playGameMusic(theme = "music") {
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

  /*
    These functions show the game title which consists of a couple of bitmap texts that are tweened.
    */
  showTitle() {
    this.gameLogo1 = this.add
      .bitmapText(this.center_width - 1000, 100, "mario", "Push", 120)
      .setOrigin(0.5)
      .setTint(0xffffff)
      .setDropShadow(3, 4, 0x75b947, 0.7);
    this.gameLogo2 = this.add
      .bitmapText(this.center_width + 1000, 220, "mario", "Pull", 120)
      .setOrigin(0.5)
      .setTint(0xffe066)
      .setDropShadow(2, 3, 0x693600, 0.7);

    this.titleTweens();
  }

  titleTweens() {
    this.tweens.add({
      targets: [this.gameLogo2],
      duration: 1000,
      x: { from: this.gameLogo2.x, to: this.center_width },
      onComplete: () => {
        this.tweens.add({
          targets: [this.gameLogo2],
          duration: 1000,
          x: "-=20",
          repeat: -1,
          ease: "Linear",
        });
      },
    });
    this.tweens.add({
      targets: [this.gameLogo1],
      duration: 1000,
      x: { from: this.gameLogo1.x, to: this.center_width },
      onComplete: () => {
        this.tweens.add({
          targets: [this.gameLogo1],
          duration: 1000,
          x: "+=20",
          repeat: -1,
          ease: "Linear",
        });
      },
    });
  }

  /*
    This plays the music of the splash scene in a loop.
  */
  playMusic(theme = "splash") {
    this.theme = this.sound.add(theme);
    this.theme.stop();
    this.theme.play({
      mute: false,
      volume: 0.5,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0,
    });
  }

  /*
    This adds a start button that can be clicked with the mouse or touched with a finger.
  */
  addStartButton() {
    this.startButton = this.add
      .bitmapText(this.center_width, 500, "mario", "start", 30)
      .setOrigin(0.5)
      .setTint(0xffe066)
      .setDropShadow(2, 3, 0x693600, 0.7);
    this.startButton.setInteractive();
    this.startButton.on("pointerdown", () => {
      this.sound.add("move").play();
      this.startGame();
    });

    this.startButton.on("pointerover", () => {
      this.startButton.setTint(0x3e6875);
    });

    this.startButton.on("pointerout", () => {
      this.startButton.setTint(0xffe066);
    });
    this.tweens.add({
      targets: this.space,
      duration: 300,
      alpha: { from: 0, to: 1 },
      repeat: -1,
      yoyo: true,
    });
  }

  /*
    This just shows the author's information and a space key that blinks.
  */
  showInstructions() {
    this.add
      .sprite(this.center_width - 80, 400, "pello")
      .setOrigin(0.5)
      .setScale(0.5);
    this.add
      .bitmapText(this.center_width + 40, 400, "mario", "By PELLO", 15)
      .setOrigin(0.5);

    this.tweens.add({
      targets: this.space,
      duration: 300,
      alpha: { from: 0, to: 1 },
      repeat: -1,
      yoyo: true,
    });
  }
}
