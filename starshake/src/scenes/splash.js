import SceneEffect from "../gameobjects/scene_effect";

export default class Splash extends Phaser.Scene {
  constructor() {
    super({ key: "splash" });
  }

  create() {
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.center_width = this.width / 2;
    this.center_height = this.height / 2;
    this.addBackground();
    this.showLogo();
    this.registry.set("currentPowerUp", 0);
    this.time.delayedCall(1000, () => this.showInstructions(), null, this);

    this.input.keyboard.on(
      "keydown-SPACE",
      () => this.transitionToChange(),
      this
    );

    this.playMusic();
  }

  /*
    The background, as the game, is a `tileSprite`, so we can scroll it to make it look like it's moving.
    */
  addBackground() {
    this.background = this.add
      .tileSprite(0, 0, this.width, this.height, "background")
      .setOrigin(0)
      .setScrollFactor(0, 1);
  }

  update() {
    this.background.tilePositionY -= 2;
    this.background.tilePositionX += 2;
  }

  /*
    We add this effect to change to another screen:
    */
  transitionToChange() {
    new SceneEffect(this).simpleClose(this.startGame.bind(this));
  }

  startGame() {
    if (this.theme) this.theme.stop();
    this.scene.start("transition", {
      next: "game",
      name: "STAGE",
      number: 1,
      time: 30,
    });
  }

  /*
    We add the logo, and then we tween it to make it move up and down.
    */
  showLogo() {
    this.gameLogoShadow = this.add
      .image(this.center_width, 250, "logo")
      .setScale(0.7)
      .setOrigin(0.5);
    this.gameLogoShadow.setOrigin(0.48);
    this.gameLogoShadow.tint = 0x3e4e43;
    this.gameLogoShadow.alpha = 0.6;
    this.gameLogo = this.add
      .image(this.center_width, 250, "logo")
      .setScale(0.7)
      .setOrigin(0.5);

    this.tweens.add({
      targets: [this.gameLogo, this.gameLogoShadow],
      duration: 500,
      y: {
        from: -200,
        to: 250,
      },
    });

    this.tweens.add({
      targets: [this.gameLogo, this.gameLogoShadow],
      duration: 1500,
      y: {
        from: 250,
        to: 200,
      },
      repeat: -1,
      yoyo: true,
    });
  }

  /*
    This is the music for the splash scene. We'll play it in a loop.
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
    Here we add the instructions to the scene.
    */
  showInstructions() {
    this.add
      .bitmapText(this.center_width, 450, "wendy", "Arrows to move", 60)
      .setOrigin(0.5)
      .setDropShadow(3, 4, 0x222222, 0.7);
    this.add
      .bitmapText(this.center_width, 500, "wendy", "SPACE to shoot", 60)
      .setOrigin(0.5)
      .setDropShadow(3, 4, 0x222222, 0.7);
    this.add
      .sprite(this.center_width - 95, 598, "pello_logo")
      .setOrigin(0.5)
      .setScale(0.3)
      .setTint(0x000000)
      .setAlpha(0.7);
    this.add
      .sprite(this.center_width - 100, 590, "pello_logo")
      .setOrigin(0.5)
      .setScale(0.3);

    this.add
      .bitmapText(this.center_width + 30, 590, "wendy", "PELLO", 50)
      .setOrigin(0.5)
      .setDropShadow(3, 4, 0x222222, 0.7);
    this.space = this.add
      .bitmapText(this.center_width, 680, "wendy", "Press SPACE to start", 60)
      .setOrigin(0.5)
      .setDropShadow(3, 4, 0x222222, 0.7);
    this.tweens.add({
      targets: this.space,
      duration: 300,
      alpha: { from: 0, to: 1 },
      repeat: -1,
      yoyo: true,
    });
  }
}
