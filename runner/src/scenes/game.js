import Player from "../gameobjects/player";
import Generator from "../gameobjects/generator";

export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: "game" });
    this.player = null;
    this.score = 0;
    this.scoreText = null;
  }

  init(data) {
    this.name = data.name;
    this.number = data.number;
  }

  /*
    We use the `preload` method to load all the assets that we need for the game.
    We also set the score to 0 in the registry, so we can access it from other scenes.
    */
  preload() {
    this.registry.set("score", "0");
    this.load.audio("coin", "assets/sounds/coin.mp3");
    this.load.audio("jump", "assets/sounds/jump.mp3");
    this.load.audio("dead", "assets/sounds/dead.mp3");
    this.load.audio("theme", "assets/sounds/theme.mp3");
    this.load.spritesheet("coin", "./assets/images/coin.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.bitmapFont(
      "arcade",
      "assets/fonts/arcade.png",
      "assets/fonts/arcade.xml"
    );
    this.score = 0;
  }

/*
Here we do several things.

- We use the `create` method to initialize the game.
- We set some variables to store width and height that we may need later.,
- We set the background color, and create the player, the obstacles, and the coins.
- We also create the keyboard input to listen to the space key.
- Also, we add a collider between the player and the obstacles and an overlap
between the player and the coins. The key part there is to set a function that will be called when the player overlaps with a coin or hits an obstacle.
*/
  create() {
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.center_width = this.width / 2;
    this.center_height = this.height / 2;

    this.cameras.main.setBackgroundColor(0x87ceeb);
    this.obstacles = this.add.group();
    this.coins = this.add.group();
    this.generator = new Generator(this);
    this.SPACE = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.player = new Player(this, this.center_width - 100, this.height - 200);
    this.scoreText = this.add.bitmapText(
      this.center_width,
      10,
      "arcade",
      this.score,
      20
    );

    this.physics.add.collider(
      this.player,
      this.obstacles,
      this.hitObstacle,
      () => {
        return true;
      },
      this
    );

    this.physics.add.overlap(
      this.player,
      this.coins,
      this.hitCoin,
      () => {
        return true;
      },
      this
    );

    this.loadAudios();
    this.playMusic();

    /*
    We use the `pointerdown` event to listen to the mouse click or touch event.
    */
    this.input.on("pointerdown", (pointer) => this.jump(), this);

    /*
    We use `updateScoreEvent` to update the score every 100ms so the player can see the score increasing as long as he survives.
    */
    this.updateScoreEvent = this.time.addEvent({
      delay: 100,
      callback: () => this.updateScore(),
      callbackScope: this,
      loop: true,
    });
  }

/*
This method is called when the player hits an obstacle. We stop the updateScoreEvent so the score doesn't increase anymore.

And obviously, we finish the scene.
*/
  hitObstacle(player, obstacle) {
    this.updateScoreEvent.destroy();
    this.finishScene();
  }

/*
This method is called when the player hits a coin. We play a sound, update the score, and destroy the coin.
*/
  hitCoin(player, coin) {
    this.playAudio("coin");
    this.updateScore(1000);
    coin.destroy();
  }

/*
We use this `loadAudios` method to load all the audio files that we need for the game.

Then we'll play them using the `playAudio` method.
*/
  loadAudios() {
    this.audios = {
      jump: this.sound.add("jump"),
      coin: this.sound.add("coin"),
      dead: this.sound.add("dead"),
    };
  }

  playAudio(key) {
    this.audios[key].play();
  }

  /*
  This method is specific to the music. We use it to play the theme music in a loop.
  */
  playMusic(theme = "theme") {
    this.theme = this.sound.add(theme);
    this.theme.stop();
    this.theme.play({
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0,
    });
  }

/*
This is the game loop. The function is called every frame.

Here is where we can check if a key was pressed or the situation of the player to act accordingly. We use the `update` method to check if the player pressed the space key.
*/
  update() {
    if (Phaser.Input.Keyboard.JustDown(this.SPACE)) {
      this.jump();
    } else if (this.player.body.blocked.down) {
      this.jumpTween?.stop();
      this.player.rotation = 0;
      // ground
    }
  }

/*
This is the method that we use to make the player jump. A jump is just a velocity in the Y-axis. Gravity will do the rest.

We also play a jumping sound and we add a tween to rotate the player while jumping.
*/
  jump() {
    if (!this.player.body.blocked.down) return;
    this.player.body.setVelocityY(-300);

    this.playAudio("jump");
    this.jumpTween = this.tweens.add({
      targets: this.player,
      duration: 1000,
      angle: { from: 0, to: 360 },
      repeat: -1,
    });
  }

/*
What should we do when we finish the game scene?

- Stop the theme music
- Play the dead sound
- Set the score in the registry to show it in the `gameover` scene.
- Start the `gameover` scene.

*/
  finishScene() {
    this.theme.stop();
    this.playAudio("dead");
    this.registry.set("score", "" + this.score);
    this.scene.start("gameover");
  }

/*
This method is called every 100ms and it is used to update the score and show it on the screen.
*/
  updateScore(points = 1) {
    this.score += points;
    this.scoreText.setText(this.score);
  }
}
