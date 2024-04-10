import FoeGenerator from "../gameobjects/foe_generator";
import Player from "../gameobjects/player";
import PowerUp from "../gameobjects/powerup";
import SceneEffect from "../gameobjects/scene_effect";

export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: "game" });
    this.player = null;
    this.score = 0;
    this.scoreText = null;
  }

  /*
    We need to initialize the scene with the data we passed from the previous scene, especially the number of the stage to load the correct background. Also, we need to get the current power-up from the registry, although we are not applying it yet.
    */
  init(data) {
    this.name = data.name;
    this.number = data.number;
    this.next = data.next;
    this.currentPowerUp = +this.registry.get("currentPowerUp");
  }

  /*
    Here we create and start all the elements of the game. We create the background, the players, the foes, the shots, the power-ups, the scores, the audios and the colliders.
    */
  create() {
    this.duration = this.time * 1000;
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.center_width = this.width / 2;
    this.center_height = this.height / 2;
    new SceneEffect(this).simpleOpen(() => 0);
    this.addBackground();
    this.cameras.main.setBackgroundColor(0x333333);
    this.lights.enable();
    this.lights.setAmbientColor(0x666666);
    this.addScores();
    this.addFoes();
    this.addPlayers();
    this.addPowerUps();
    this.addShots();
    this.loadAudios();
    this.addColliders();
  }

  /*
    This is how we create an infinite background. We create a tileSprite with the size of the screen and we set the origin to 0,0. Then we set the scroll factor to 0,1 so it will scroll only in the Y axis.
    */
  addBackground() {
    this.background = this.add
      .tileSprite(0, 0, this.width, this.height, "stage" + this.number)
      .setOrigin(0)
      .setScrollFactor(0, 1);
  }

  /*
    This is the method that will be called from the foe generator when a wave is destroyed. We create a new power up and we add it to the power-up group.
    */
  spawnShake() {
    const { x, y } = this.lastDestroyedWaveFoe;
    this.shake = new PowerUp(this, x, y);
    this.powerUps.add(this.shake);
  }

  /*
    This adds the score text to the scene. We create a group of scores, one for each player. We add the score text to the group and we set the scroll factor to 0 so it will not scroll with the camera.
    */
  addScores() {
    this.scores = {
      player1: {},
      player2: {},
    };

    this.scores["player1"]["scoreText"] = this.add
      .bitmapText(
        150,
        16,
        "wendy",
        String(this.registry.get("score_player1")).padStart(6, "0"),
        50
      )
      .setOrigin(0.5)
      .setScrollFactor(0);
    this.scores["player2"]["scoreText"] = this.add
      .bitmapText(this.width - 150, 16, "wendy", "0".padStart(6, "0"), 50)
      .setOrigin(0.5)
      .setScrollFactor(0);
  }

  /*
    This adds the players to the scene. We create a group of players but in this particular implementation, we just add one player.
    */
  addPlayers() {
    this.trailLayer = this.add.layer();
    this.players = this.add.group();
    this.player = new Player(this, this.center_width, this.center_height);
    this.players.add(this.player);
  }

  /*
    Next, we have some functions to add other groups for the game elements.
    */
  addShots() {
    this.shotsLayer = this.add.layer();
    this.shots = this.add.group();
  }

  addFoes() {
    this.foeGroup = this.add.group();
    this.foeWaveGroup = this.add.group();
    this.foeShots = this.add.group();
    this.foes = new FoeGenerator(this);
  }

  addPowerUps() {
    this.available = ["fruit", "vanila", "chocolate"];
    this.powerUps = this.add.group();
  }

  /*
    Once we have created all groups of elements, we add the colliders between them.
    */
  addColliders() {
    this.physics.add.collider(
      this.players,
      this.foeGroup,
      this.crashFoe,
      () => {
        return true;
      },
      this
    );

    this.physics.add.collider(
      this.players,
      this.foeWaveGroup,
      this.crashFoe,
      () => {
        return true;
      },
      this
    );

    this.physics.add.overlap(
      this.shots,
      this.foeGroup,
      this.destroyFoe,
      () => {
        return true;
      },
      this
    );

    this.physics.add.overlap(
      this.shots,
      this.foeWaveGroup,
      this.destroyWaveFoe,
      () => {
        return true;
      },
      this
    );

    this.physics.add.collider(
      this.players,
      this.powerUps,
      this.pickPowerUp,
      () => {
        return true;
      },
      this
    );

    this.physics.add.overlap(
      this.players,
      this.foeShots,
      this.hitPlayer,
      () => {
        return true;
      },
      this
    );

    this.physics.add.collider(
      this.shots,
      this.foeShots,
      this.destroyShot,
      () => {
        return true;
      },
      this
    );
    this.physics.world.on("worldbounds", this.onWorldBounds);
  }

  /*
    This is the callback for the world bounds and we will use it to destroy elements that the game does not need anymore. We check if the element is a shot and if it is, we destroy it. We also destroy the shadow of the shot. We do this because the shadow is not a child of the shot, so it will not be destroyed automatically.
    */
  onWorldBounds(body, t) {
    const name = body.gameObject.name.toString();
    if (["foeshot", "shot"].includes(name)) {
      body.gameObject.shadow.destroy();
      body.gameObject.destroy();
    }
  }

  /*
    This is the callback for the collision between two shots. We destroy both shots and we create an explosion where they meet.
    */
  destroyShot(shot, foeShot) {
    const point = this.lights.addPointLight(shot.x, shot.y, 0xffffff, 10, 0.7);
    this.tweens.add({
      targets: point,
      duration: 400,
      scale: { from: 1, to: 0 },
    });
    this.playAudio("foexplosion");
    shot.shadow.destroy();
    shot.destroy();
    foeShot.shadow.destroy();
    foeShot.shot();
    this.updateScore(shot.playerName, 50);
  }

  /*
    This is called when we destroy a foe that is part of a wave.
    */
  destroyWaveFoe(shot, foe) {
    this.lastDestroyedWaveFoe = { x: foe.x, y: foe.y };
    this.destroyFoe(shot, foe);
  }

  /*
  This is the callback we call when a shot hits a foe. We destroy the shot and we decrease the lives of the foe. If the foe has no more lives, we destroy it and we create an explosion. We also add the points to the score of the player who shoots the foe.
    */
  destroyFoe(shot, foe) {
    foe.lives--;
    this.playAudio("foexplosion");
    const point = this.lights.addPointLight(shot.x, shot.y, 0xffffff, 10, 0.7);
    this.tweens.add({
      targets: point,
      duration: 400,
      scale: { from: 1, to: 0 },
    });
    this.tweens.add({
      targets: foe,
      duration: 400,
      tint: { from: 0xffffff, to: 0xff0000 },
    });
    this.updateScore(shot.playerName, 50);
    this.tweens.add({ targets: foe, y: "-=10", yoyo: true, duration: 100 });

    shot.destroy();
    if (foe.lives === 0) {
      this.playAudio("foedestroy");
      const point = this.lights.addPointLight(
        shot.x,
        shot.y,
        0xffffff,
        10,
        0.7
      );
      this.tweens.add({
        targets: point,
        duration: 400,
        scale: { from: 1, to: 0 },
      });
      this.updateScore(shot.playerName, foe.points);
      foe.dead();
    }
  }

  /*
  This one is called when a foe shot hits the player. Unless the player is blinking (because it just started), we destroy the player and we create an explosion. We also destroy the shadow of the shot. Then we respawn the player
    */
  hitPlayer(player, shot) {
    if (player.blinking) return;

    this.players.remove(this.player);
    player.dead();
    this.playAudio("explosion");
    shot.shadow.destroy();
    shot.destroy();
    this.time.delayedCall(1000, () => this.respawnPlayer(), null, this);
  }

  /*
    This one is called when a player crashes with a foe. Unless the player is blinking (because it just started), we destroy the player, and the foe and also at the end we respawn the player.
    */
  crashFoe(player, foe) {
    if (player.blinking) return;
    player.dead();
    this.playAudio("explosion");
    foe.dead();
    this.time.delayedCall(1000, () => this.respawnPlayer(), null, this);
  }

  /*
    This is the callback when the player picks a powerup. We update the power-up of the player and we destroy the power-up. We also create a tween to make the player blink.
    */
  pickPowerUp(player, powerUp) {
    this.playAudio("stageclear1");
    this.updatePowerUp(player, powerUp);
    this.tweens.add({
      targets: player,
      duration: 200,
      alpha: { from: 0.5, to: 1 },
      scale: { from: 1.4, to: 1 },
      repeat: 3,
    });
    powerUp.destroy();
  }

  /*
    This adds a player to the game. We create a tween to make the player blink and then we create a new player.
    */
  respawnPlayer() {
    this.player = new Player(this, this.center_width, this.center_height);
    this.player.blinking = true;
    this.players.add(this.player);
    this.tweens.add({
      targets: this.player,
      duration: 100,
      alpha: { from: 0, to: 1 },
      repeat: 10,
      onComplete: () => {
        this.player.blinking = false;
      },
    });
  }

  /*
    Here we load all the audio, and we add them to the `this.audios` object. Later we can play them with the `playAudio` method.
    */
  loadAudios() {
    this.audios = {
      shot: this.sound.add("shot"),
      foeshot: this.sound.add("foeshot"),
      explosion: this.sound.add("explosion"),
      foexplosion: this.sound.add("foexplosion"),
      foedestroy: this.sound.add("foedestroy"),
      stageclear1: this.sound.add("stageclear1"),
      stageclear2: this.sound.add("stageclear2"),
      boss: this.sound.add("boss"),
    };
  }

  playAudio(key) {
    this.audios[key].play();
  }

  /*
    The game loop is as simple as this. We update the player and the foes. We also update the background to make it scroll.
    */
  update() {
    if (this.player) this.player.update();
    this.foes.update();
    this.background.tilePositionY -= 10;
  }

  /*
    When the player finishes the stage, we destroy all the elements and we start the transition to the next scene.
    */
  endScene() {
    this.foeWaveGroup.children.entries.forEach((foe) => foe.shadow.destroy());
    this.foeGroup.children.entries.forEach((foe) => foe.shadow.destroy());
    this.shots.children.entries.forEach((shot) => shot.shadow.destroy());
    this.foeShots.children.entries.forEach((shot) => shot.shadow.destroy());
    this.time.delayedCall(
      2000,
      () => {
        this.finishScene();
      },
      null,
      this
    );
  }

  /*
    This is the callback for the end of the scene. We stop all the audio, we stop the scene and we start the transition to the next scene.
    */
  finishScene() {
    this.game.sound.stopAll();
    this.scene.stop("game");
    const scene = this.number < 5 ? "transition" : "outro";
    this.scene.start(scene, {
      next: "game",
      name: "STAGE",
      number: this.number + 1,
    });
  }

  /*
    The power-up looks the same but the effect is different. We keep increasing its value so we can apply the effect to the player. In this game, the power-up applies another shooting pattern.
    */
  updatePowerUp(player, powerUp) {
    player.powerUp = this.available[this.currentPowerUp];
    this.currentPowerUp =
      this.currentPowerUp + 1 === this.available.length
        ? this.currentPowerUp
        : this.currentPowerUp + 1;
    this.registry.set("currentPowerUp", this.currentPowerUp);
  }

  /*
    This is the method we use to update the score of the player. We get the score from the registry and we update it. We also create a tween to make the score text blink.
    */
  updateScore(playerName, points = 0) {
    const score = +this.registry.get("score_" + playerName) + points;
    this.registry.set("score_" + playerName, score);
    this.scores[playerName]["scoreText"].setText(
      String(score).padStart(6, "0")
    );
    this.tweens.add({
      targets: this.scores[playerName]["scoreText"],
      duration: 200,
      tint: { from: 0x0000ff, to: 0xffffff },
      scale: { from: 1.2, to: 1 },
      repeat: 2,
    });
  }
}
