import Player from "../gameobjects/player";
import DungeonGenerator from "../gameobjects/dungeon_generator";

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

  preload() {
    this.registry.set("seconds", 0);
    this.registry.set("coins", 0);
    this.registry.set("keys", 0);
  }

  /*
    From this, we create the whole thing. We call the methods to add the map, the player, the collisions, the camera and the scores.
  */
  create() {
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.center_width = this.width / 2;
    this.center_height = this.height / 2;

    this.addMap();
    this.addPlayer();
    this.addCollisions();
    this.addCamera();
    this.addScores();
    this.loadAudios();
  }

  /*
    This method creates the map using the DungeonGenerator class.
  */
  addMap() {
    this.dungeon = new DungeonGenerator(this);
    this.input.keyboard.on("keydown-ENTER", () => this.finishScene(), this);
  }

  /*
    This method adds the scores to the scene. We add the coins, the seconds, the keys and the timer. We'll update them with other methods.
  */
  addScores() {
    this.add
      .sprite(62, 26, "coin", 0)
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setScale(0.8);
    this.scoreCoins = this.add
      .bitmapText(100, 24, "default", "x0", 15)
      .setOrigin(0.5)
      .setScrollFactor(0);
    this.scoreSeconds = this.add
      .bitmapText(this.center_width, 24, "default", "0", 15)
      .setOrigin(0.5)
      .setScrollFactor(0);
    this.add
      .sprite(this.width - 90, 24, "keys", 0)
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setScale(0.8);
    this.scoreKeys = this.add
      .bitmapText(this.width - 48, 24, "default", "x0", 15)
      .setOrigin(0.5)
      .setScrollFactor(0);
    this.timer = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.updateSeconds();
      },
      callbackScope: this,
      loop: true,
    });
  }

  /*
    This method adds the player to the scene. It creates a new Player object along with a trail layer that will be used to draw the trail of the player.
  */
  addPlayer() {
    this.trailLayer = this.add.layer();
    this.player = new Player(
      this,
      this.dungeon.map.widthInPixels / 2,
      this.dungeon.map.heightInPixels / 2,
      100
    );
  }

  /*
  This method sets up the collisions between the player and anything else. Basically, it sets a callback function that will be called when the player collides with something.
  */
  addCollisions() {
    this.unsubscribePlayerCollide = this.matterCollision.addOnCollideStart({
      objectA: this.player.sprite,
      callback: this.onPlayerCollide,
      context: this,
    });

    this.matter.world.on("collisionstart", (event) => {
      event.pairs.forEach((pair) => {
        const bodyA = pair.bodyA;
        const bodyB = pair.bodyB;
      });
    });
  }

  /*
  This is the callback that we call when the player collides with something. We check the label of the object that the player collides with and call the corresponding method.
  */
  onPlayerCollide({ gameObjectA, gameObjectB }) {
    if (!gameObjectB) return;
    if (gameObjectB.label === "coin") this.playerPicksCoin(gameObjectB);
    if (gameObjectB.label === "keys") this.playerPicksKey(gameObjectB);
    if (gameObjectB.label === "bat") this.playerHitsFoe(gameObjectB);
    if (gameObjectB.label === "wizard") this.playerHitsFoe(gameObjectB);
    if (gameObjectB.label === "fireball") this.playerHitsFoe(gameObjectB);
    if (!(gameObjectB instanceof Phaser.Tilemaps.Tile)) return;

    const tile = gameObjectB;

    if (tile.properties.isLethal) {
      this.unsubscribePlayerCollide();
      this.restartScene();
    }
  }

  /*
  This is called when a player picks a coin. It destroys the coin and updates the score.
  */
  playerPicksCoin(coin) {
    this.showPoints(coin.x, coin.y, 1, this.scoreCoins);
    coin.destroy();
    this.updateCoins();
    this.playAudio("coin");
  }

  /*
  Same as the previous one but with the key.
  */
  playerPicksKey(key) {
    this.updateKeys();
    this.showPoints(
      key.x,
      key.y,
      this.registry.get("keys") + "/" + this.dungeon.dungeon.rooms.length,
      this.scoreKeys
    );
    key.destroy();
  }

  /*
  Unless the player is invincible (blinking at the beginning), this is called when the player hits any foe. It kills the player, destroys the foe, and restarts the scene.
  */
  playerHitsFoe(foe) {
    if (this.player.invincible) return;
    this.player.explosion();
    foe.destroy();
    this.restartScene();
  }

  /*
  Every time we need to show points, we call this method. It creates a text element, adds a tween to it, and destroys it when the tween is finished.
  */
  showPoints(x, y, score, textElement, color = 0xffffff) {
    let text = this.add
      .bitmapText(x + 20, y - 80, "default", "+" + score, 10)
      .setDropShadow(2, 3, color, 0.7)
      .setOrigin(0.5);
    this.tweens.add({
      targets: text,
      duration: 1000,
      alpha: { from: 1, to: 0 },
      x: {
        from: text.x + Phaser.Math.Between(-10, 10),
        to: text.x + Phaser.Math.Between(-40, 40),
      },
      y: { from: text.y - 10, to: text.y - 60 },
      onComplete: () => {
        text.destroy();
      },
    });

    this.textUpdateEffect(textElement, color);
  }

  /*
  This method adds the camera to the scene and the background color. It sets the bounds of the camera to the size of the map and makes it follow the player.
  */
  addCamera() {
    this.cameras.main.setBounds(
      0,
      0,
      this.dungeon.map.widthInPixels,
      this.dungeon.map.heightInPixels
    );
    this.cameras.main.startFollow(this.player.sprite, false, 0.5, 0.5);
    this.cameras.main.setBackgroundColor(0x25131a);
  }

  /*
  As we did in other games, here we add the audio files to the scene along with a method to play them.
  */
  loadAudios() {
    this.audios = {
      jump: this.sound.add("jump"),
      bubble: this.sound.add("bubble"),
      trap: this.sound.add("trap"),
      crash: this.sound.add("crash"),
      fireball: this.sound.add("fireball"),
      death: this.sound.add("death"),
      coin: this.sound.add("start"),
    };
  }

  playAudio(key) {
    this.audios[key].play();
  }

  /*
  This method is called when the player dies. It makes the camera shake and fade out and then restarts the scene.
  */
  restartScene() {
    this.player.sprite.visible = false;
    this.cameras.main.shake(100);
    this.cameras.main.fade(250, 0, 0, 0);
    this.cameras.main.once("camerafadeoutcomplete", () => this.scene.restart());
  }

  /*
  If a player finishes the stage, we fade out the camera and start the outro scene.
  */
  finishScene() {
    this.cameras.main.fade(250, 0, 0, 0);
    this.cameras.main.once("camerafadeoutcomplete", () => {
      this.scene.start("outro", {
        next: "underwater",
        name: "STAGE",
        number: this.number + 1,
      });
    });
  }

  /*
    This method is called every second. It updates the seconds and the timer because, for any competitive player, time is the most important thing. We could add a scoreboard at the end ordered by time.
  */
  updateSeconds(points = 1) {
    const seconds = +this.registry.get("seconds") + points;
    this.registry.set("seconds", seconds);
    this.scoreSeconds.setText(seconds);
  }

  /*
  The next two functions update the coins and keys scores. In the case of the keys, if the player has collected all the keys, we finish the scene.
  */
  updateCoins(points = 1) {
    const coins = +this.registry.get("coins") + points;
    this.registry.set("coins", coins);
    this.scoreCoins.setText("x" + coins);
  }

  updateKeys(points = 1) {
    const keys = +this.registry.get("keys") + points;
    this.registry.set("keys", keys);
    this.scoreKeys.setText("x" + keys);
    if (keys === this.dungeon.dungeon.rooms.length) {
      this.finishScene();
    }
  }

  /*
  We have this method to update the text elements when we add points to the score. In this class is not used currently but we could use it later or in other classes.
  */
  textUpdateEffect(textElement, color) {
    textElement.setTint(color);
    const prev = textElement.y;
    this.tweens.add({
      targets: textElement,
      duration: 100,
      alpha: { from: 1, to: 0.8 },
      scale: { from: 1.2, to: 1 },
      repeat: 5,
      onComplete: () => {
        textElement.setTint(0xffffff);
        textElement.y = prev;
      },
    });
  }
}
