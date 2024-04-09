export default class Splash extends Phaser.Scene {
  constructor() {
    super({ key: "splash" });
  }

  /*
  As always, we create everything we need on the scene from the create method.
  */
  create() {
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.center_width = this.width / 2;
    this.center_height = this.height / 2;

    this.backLayer = this.add.layer();
    this.cameras.main.setBackgroundColor(0x000000);
    this.showTitle();
    this.addPlayerAndFoe();
    this.addAnimationTweens();

    this.time.delayedCall(1000, () => this.showInstructions(), null, this);

    this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);
    this.input.keyboard.on("keydown-ENTER", () => this.startGame(), this);
    this.playMusic();
  }

  startGame() {
    if (this.theme) this.theme.stop();
    this.scene.start("transition");
  }

  /*
    This shows the title of the game. It's a bitmap text with a shadow and a tween to make it move.
  */
  showTitle() {
    this.textShadow1 = this.add
      .bitmapText(this.center_width, 100, "default", "DUNGEON", 85)
      .setTint(0xff787a)
      .setOrigin(0.5);
    this.textShadow2 = this.add
      .bitmapText(this.center_width, 250, "default", "BOBBLE", 85)
      .setTint(0xff787a)
      .setOrigin(0.5);
    this.text1 = this.add
      .bitmapText(this.center_width, 100, "default", "DUNGEON", 85)
      .setTint(0x302030)
      .setOrigin(0.5);
    this.text2 = this.add
      .bitmapText(this.center_width, 250, "default", "BOBBLE", 85)
      .setTint(0x302030)
      .setOrigin(0.5);
    this.text11 = this.add
      .bitmapText(this.center_width, 100, "default", "DUNGEON", 88)
      .setTint(0x00aafb)
      .setOrigin(0.5);
    this.text22 = this.add
      .bitmapText(this.center_width, 250, "default", "BOBBLE", 88)
      .setTint(0x00aafb)
      .setOrigin(0.5);
    this.tweens.add({
      targets: [this.textShadow1, this.textShadow2],
      duration: 1000,
      x: "+=10",
      y: "+=10",
      yoyo: true,
      repeat: -1,
    });
  }

  /*
    This method plays the music of the game. It's a looped music with a volume of 0.3.
  */
  playMusic(theme = "splash") {
    this.theme = this.sound.add(theme);
    this.theme.stop();
    this.theme.play({
      mute: false,
      volume: 0.3,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0,
    });
  }

  /*
    This method shows the instructions of the game, the classic controls, the author, and a blinking text to start the game.
  */
  showInstructions() {
    this.add
      .bitmapText(this.center_width, 430, "default", "WASD/Arrows: move", 30)
      .setDropShadow(1, 1, 0xff787a, 0.7)
      .setOrigin(0.5);
    this.add
      .sprite(this.center_width - 60, 490, "pello")
      .setOrigin(0.5)
      .setScale(0.3);
    this.add
      .bitmapText(this.center_width + 40, 490, "default", "By PELLO", 15)
      .setDropShadow(1, 1, 0xff787a, 0.7)
      .setOrigin(0.5);
    this.space = this.add
      .bitmapText(this.center_width, 550, "default", "Press SPACE to start", 25)
      .setDropShadow(1, 1, 0x3d253b, 0.7)
      .setOrigin(0.5);
    this.tweens.add({
      targets: this.space,
      duration: 300,
      alpha: { from: 0, to: 1 },
      repeat: -1,
      yoyo: true,
    });
  }

  /*
    This method adds the player and the foe to the scene and creates the animations for both.
  */
  addPlayerAndFoe() {
    this.player = this.add.sprite(this.width - 100, 350, "player").setScale(2);
    this.anims.create({
      key: "playeridle",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1,
    });
    this.player.anims.play("playeridle");
    this.foe = this.add.sprite(this.width, 350, "wizard").setScale(2);
    this.anims.create({
      key: "foe",
      frames: this.anims.generateFrameNumbers("wizard", { start: 0, end: 4 }),
      frameRate: 5,
      repeat: -1,
    });
    this.foe.anims.play("foe");
  }

  /*
    We also add some tweens to the player and the foe to make them move. The interesting part is how we can use the tweens to simulate a walk cycle. We just need to change the x value of the target and flip the sprite.
  */
  addAnimationTweens() {
    this.tweens.add({
      targets: [this.player],
      x: { from: this.player.x, to: 0 },
      duration: 2500,
      yoyo: true,
      repeat: -1,
      onYoyo: () => {
        this.player.flipX = !this.player.flipX;
      },
      onRepeat: () => {
        this.player.flipX = !this.player.flipX;
      },
    });

    this.tweens.add({
      targets: [this.foe],
      x: { from: this.foe.x, to: 100 },
      duration: 2500,
      yoyo: true,
      repeat: -1,
      onYoyo: () => {
        this.foe.flipX = !this.foe.flipX;
      },
      onRepeat: () => {
        this.foe.flipX = !this.foe.flipX;
      },
    });
  }
}
