import Player from "../gameobjects/player";
import { Debris } from "../gameobjects/particle";
import Bat from "../gameobjects/bat";
import Zombie from "../gameobjects/zombie";
import Turn from "../gameobjects/turn";
import Coin from "../gameobjects/coin";
import LunchBox from "../gameobjects/lunchbox";
import Platform from "../gameobjects/platform";
import Phaser from "phaser";

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

  preload() {}

  /*
    This function creates the game. It sets the width and height of the game, the center of the width and height, and the background color. Then it calls the functions to create the rest of the elements of the game.
    */
  create() {
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.center_width = this.width / 2;
    this.center_height = this.height / 2;
    this.cameras.main.setBackgroundColor(0x62a2bf); //(0x00b140)//(0x62a2bf)
    this.add.tileSprite(0, 1000, 1024 * 10, 512, "landscape").setOrigin(0.5);
    this.createMap();

    this.cameras.main.setBounds(0, 0, 20920 * 2, 20080 * 2);
    this.physics.world.setBounds(0, 0, 20920 * 2, 20080 * 2);
    this.addPlayer();

    this.cameras.main.startFollow(this.player, true, 0.05, 0.05, 0, 240);
    this.physics.world.enable([this.player]);
    this.addScore();
    this.loadAudios();
    this.playMusic();
  }

  /*
    This function adds the score to the game. It creates the text and the coin icon. It will be updated when the player picks a coin.
    */
  addScore() {
    this.scoreCoins = this.add
      .bitmapText(75, 10, "pixelFont", "x0", 30)
      .setDropShadow(0, 4, 0x222222, 0.9)
      .setOrigin(0)
      .setScrollFactor(0);
    this.scoreCoinsLogo = this.add
      .sprite(50, 25, "coin")
      .setScale(1)
      .setOrigin(0.5)
      .setScrollFactor(0);
    const coinAnimation = this.anims.create({
      key: "coinscore",
      frames: this.anims.generateFrameNumbers("coin", { start: 0, end: 7 }),
      frameRate: 8,
    });
    this.scoreCoinsLogo.play({ key: "coinscore", repeat: -1 });
  }

  /*
    This function creates the map of the game. It loads the tilemap and the tilesets and it creates the layers and the objects defined on the tilemap. It also creates the groups for the foes, the platforms, the turns, the exits, the lunchboxes, and the bricks. Finally, it calls the function to create the colliders.
    */
  createMap() {
    this.tileMap = this.make.tilemap({
      key: "scene" + this.number,
      tileWidth: 64,
      tileHeight: 64,
    });
    this.tileSetBg = this.tileMap.addTilesetImage("background");
    console.log(this.tileMap);
    this.tileMap.createLayer("background", this.tileSetBg);

    this.tileSet = this.tileMap.addTilesetImage("softbricks");
    this.platform = this.tileMap.createLayer(
      "scene" + this.number,
      this.tileSet
    );
    this.objectsLayer = this.tileMap.getObjectLayer("objects");

    this.platform.setCollisionByExclusion([-1]);

    this.batGroup = this.add.group();
    this.zombieGroup = this.add.group();
    this.foesGroup = this.add.group();
    this.turnGroup = this.add.group();
    this.exitGroup = this.add.group();
    this.platformGroup = this.add.group();
    this.lunchBoxGroup = this.add.group();
    this.bricks = this.add.group();

    this.addsObjects();
    this.addColliders();
  }

  /*
    This function adds the objects defined on the objects layer of the tilemap to the game. Yeah, I know, I could have used a switch statement here, but lately, I'm trying to avoid them as much as I can.
    */
  addsObjects() {
    this.objectsLayer.objects.forEach((object) => {
      if (object.name === "bat") {
        let bat = new Bat(this, object.x, object.y, object.type);
        this.batGroup.add(bat);
        this.foesGroup.add(bat);
      }

      if (object.name === "zombie") {
        let zombie = new Zombie(this, object.x, object.y, object.type);
        this.zombieGroup.add(zombie);
        this.foesGroup.add(zombie);
      }

      if (object.name === "platform") {
        this.platformGroup.add(
          new Platform(this, object.x, object.y, object.type)
        );
      }

      if (object.name === "turn") {
        this.turnGroup.add(new Turn(this, object.x, object.y));
      }

      if (object.name === "lunchbox") {
        this.lunchBoxGroup.add(new LunchBox(this, object.x, object.y));
      }

      if (object.name === "text") {
        this.add
          .bitmapText(object.x, object.y, "pixelFont", object.text.text, 30)
          .setDropShadow(2, 4, 0x222222, 0.9)
          .setOrigin(0);
      }

      if (object.name === "exit") {
        this.exitGroup.add(
          new Turn(
            this,
            object.x,
            object.y,
            object.width,
            object.height,
            object.type
          ).setOrigin(0.5)
        );
      }
    });
  }

  /*
    Once we have our objects, foes, and platforms in the game, we add the colliders between them.
    */
  addColliders() {
    this.physics.add.collider(
      this.batGroup,
      this.platform,
      this.turnFoe,
      () => {
        return true;
      },
      this
    );

    this.physics.add.collider(
      this.zombieGroup,
      this.bricks,
      this.turnFoe,
      () => {
        return true;
      },
      this
    );

    this.physics.add.collider(
      this.batGroup,
      this.bricks,
      this.turnFoe,
      () => {
        return true;
      },
      this
    );

    this.physics.add.collider(
      this.zombieGroup,
      this.turnGroup,
      this.turnFoe,
      () => {
        return true;
      },
      this
    );

    this.physics.add.collider(
      this.zombieGroup,
      this.platform,
      this.hitFloor,
      () => {
        return true;
      },
      this
    );
  }

  /*
    This function is called when a foe touches a turn object. It turns the foe.
    */
  turnFoe(foe, platform) {
    foe.turn();
  }

  /*
    This callback is empty but here we could add some effects. It is called when a foe hits the floor.
    */
  hitFloor() {}

  /*
    We add the player to the game and we add the colliders between the player and the rest of the elements. The starting position of the player is defined on the tilemap.
    */
  addPlayer() {
    this.elements = this.add.group();
    this.coins = this.add.group();

    const playerPosition = this.objectsLayer.objects.find(
      (object) => object.name === "player"
    );
    this.player = new Player(this, playerPosition.x, playerPosition.y, 0);

    this.physics.add.collider(
      this.player,
      this.platform,
      this.hitFloor,
      () => {
        return true;
      },
      this
    );

    this.physics.add.collider(
      this.player,
      this.platformGroup,
      this.hitFloor,
      () => {
        return true;
      },
      this
    );

    this.physics.add.collider(
      this.player,
      this.bricks,
      this.hitFloor,
      () => {
        return true;
      },
      this
    );

    this.physics.add.overlap(
      this.player,
      this.coins,
      this.pickCoin,
      () => {
        return true;
      },
      this
    );

    this.physics.add.overlap(
      this.player,
      this.lunchBoxGroup,
      this.pickLunchBox,
      () => {
        return true;
      },
      this
    );

    this.physics.add.overlap(
      this.player,
      this.exitGroup,
      () => {
        this.playAudio("stage");
        this.time.delayedCall(1000, () => this.finishScene(), null, this);
      },
      () => {
        return true;
      },
      this
    );

    this.blows = this.add.group();

    this.physics.add.overlap(
      this.blows,
      this.platform,
      this.blowPlatform,
      () => {
        return true;
      },
      this
    );

    this.physics.add.overlap(
      this.blows,
      this.bricks,
      this.blowBrick,
      () => {
        return true;
      },
      this
    );

    this.physics.add.overlap(
      this.blows,
      this.foesGroup,
      this.blowFoe,
      () => {
        return true;
      },
      this
    );

    this.physics.add.overlap(
      this.bricks,
      this.foesGroup,
      this.foeBlowBrick,
      () => {
        return true;
      },
      this
    );

    this.physics.add.collider(
      this.player,
      this.batGroup,
      this.hitPlayer,
      () => {
        return true;
      },
      this
    );

    this.physics.add.collider(
      this.player,
      this.zombieGroup,
      this.hitPlayer,
      () => {
        return true;
      },
      this
    );
  }

  /*
    This function is called when the player picks a coin. It disables the coin (to avoid picking it up again while it animates), plays the sound, and updates the score. Same with the lunchbox.
    */
  pickCoin(player, coin) {
    if (!coin.disabled) {
      coin.pick();
      this.playAudio("coin");
      this.updateCoins();
    }
  }

  pickLunchBox(player, lunchBox) {
    if (!lunchBox.disabled) {
      this.playAudio("lunchbox");
      lunchBox.pick();
    }
  }

  /*
    This function is called when the player hits a foe. If the player is invincible (because of a power-up), then the foe dies. If not, then the player dies.
    */
  hitPlayer(player, foe) {
    if (player.invincible) {
      foe.death();
      this.playAudio("foedeath");
    } else if (!player.dead && this.number > 0) {
      player.die();
      this.playAudio("death");
    }
  }

  /*
    This is called when the player blows a foe. On the screen, the player generates a blow object and when this collides with a foe, the enemy is destroyed. It plays the sound and kills the foe.
    */
  blowFoe(blow, foe) {
    this.playAudio("kill");
    this.playAudio("foedeath");
    foe.death();
  }

  /*
    When a foe touches a brick it turns around and it changes direction.
    */
  foeBlowBrick(brick, foe) {
    foe.turn();
    Array(Phaser.Math.Between(4, 6))
      .fill(0)
      .forEach((i) => new Debris(this, brick.x, brick.y));
    brick.destroy();
  }

  /*
    This is called when the player blows an object of the platform layer on the tilemap. On the screen, the player generates a blow object and when this collides with a brick, if that brick is marked in the map as breakable, the brick is destroyed. It plays the sound and kills the brick, and at the end, it calls spawCoin: a function that randomly spawns a coin.
    */
  blowPlatform(blow, platform) {
    const tile = this.getTile(platform);
    if (this.isBreakable(tile)) {
      this.playAudioRandomly("stone_fail");
      this.playAudioRandomly("stone");
      if (this.player.mjolnir) this.cameras.main.shake(30);
      blow.destroy();
      Array(Phaser.Math.Between(4, 6))
        .fill(0)
        .forEach((i) => new Debris(this, tile.pixelX, tile.pixelY));
      this.platform.removeTileAt(tile.x, tile.y);
      this.spawnCoin(tile);
    }
  }

  getTile(platform) {
    const { x, y } = platform;
    return this.platform.getTileAt(x, y);
  }

  isBreakable(tile) {
    return tile?.properties["element"] === "break";
  }

  spawnCoin(tile) {
    if (Phaser.Math.Between(0, 11) > 5) {
      this.time.delayedCall(
        500,
        () => {
          this.coins.add(new Coin(this, tile.pixelX, tile.pixelY));
        },
        null,
        this
      );
    }
  }

  /*
    This is similar to the function that blows platforms but it is applied to bricks generated by the player during the game.
    */
  blowBrick(blow, brick) {
    if (this.player.mjolnir) this.cameras.main.shake(30);
    this.playAudio("stone_fail");
    this.playAudioRandomly("stone");
    blow.destroy();
    Array(Phaser.Math.Between(4, 6))
      .fill(0)
      .forEach((i) => new Debris(this, brick.x, brick.y));
    brick.destroy();
  }

  /*
    When the player hits the floor, if it is jumping and it is not falling, then it checks if the tile is breakable. If it is, then it destroys the tile and it plays the sound. Same with the bricks generated by the player.
    */
  hitFloor(player, platform) {
    if (
      this.player.jumping &&
      !this.player.falling &&
      this.player.body.velocity.y === 0
    ) {
      const tile = this.getTile(platform);
      if (this.isBreakable(tile)) {
        this.playAudioRandomly("stone");
        Array(Phaser.Math.Between(4, 6))
          .fill(0)
          .forEach((i) => new Debris(this, tile.pixelX, tile.pixelY));
        this.platform.removeTileAt(tile.x, tile.y);
      } else if (platform?.name === "brick0") {
        this.playAudioRandomly("stone");
        Array(Phaser.Math.Between(4, 6))
          .fill(0)
          .forEach((i) => new Debris(this, platform.x, platform.y));
        platform.destroy();
      }
    }
  }

  /*
    This will load all the audio files used in the game. It is called from the create function, and so we can use `this.audios` to play the sounds.
    */
  loadAudios() {
    this.audios = {
      build: this.sound.add("build"),
      coin: this.sound.add("coin"),
      death: this.sound.add("death"),
      jump: this.sound.add("jump"),
      kill: this.sound.add("kill"),
      land: this.sound.add("land"),
      lunchbox: this.sound.add("lunchbox"),
      prize: this.sound.add("prize"),
      stone_fail: this.sound.add("stone_fail"),
      stone: this.sound.add("stone"),
      foedeath: this.sound.add("foedeath"),
      stage: this.sound.add("stage"),
    };
  }

  playAudio(key) {
    this.audios[key].play();
  }

  /*
      This plays the audio with a random volume and rate to add more variety to some sounds that otherwise would sound too repetitive.
      */
  playAudioRandomly(key) {
    const volume = Phaser.Math.Between(0.8, 1);
    const rate = Phaser.Math.Between(0.8, 1);
    this.audios[key].play({ volume, rate });
  }

  /*
      This plays the music of the game. It is called from the create function, and so we can use `this.theme` to play the music.
      */
  playMusic(theme = "game") {
    this.theme = this.sound.add("music" + this.number);
    this.theme.stop();
    this.theme.play({
      mute: false,
      volume: 0.7,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0,
    });
  }

  /*
    The game loop. It updates the player and checks if the player has fallen from the map (we could add pits for this). If it has, then it restarts the scene.
    */
  update() {
    this.player.update();
    if (this.number === 3 && this.player.y > 1500) this.restartScene();
  }

  /*
    This is called when the player reaches the exit. It stops the music and it starts the transition scene increasing the stage number, so we will load the next map.
    */
  finishScene() {
    if (this.theme) this.theme.stop();
    this.scene.start("transition", { name: "STAGE", number: this.number + 1 });
  }

  /*
    This is called when the player dies. It stops the music and it starts the transition scene without increasing the stage number.
    */
  restartScene() {
    this.time.delayedCall(
      1000,
      () => {
        if (this.theme) this.theme.stop();
        this.scene.start("transition", { name: "STAGE", number: this.number });
      },
      null,
      this
    );
  }

  /*
    This is called when the player picks a coin. It updates the score from the registry and it adds a little tween effect to the score text.
    */
  updateCoins() {
    const coins = +this.registry.get("coins") + 1;
    this.registry.set("coins", coins);
    this.scoreCoins.setText("x" + coins);
    this.tweens.add({
      targets: [this.scoreCoins, this.scoreCoinsLogo],
      scale: { from: 1.4, to: 1 },
      duration: 50,
      repeat: 10,
    });
  }
}
