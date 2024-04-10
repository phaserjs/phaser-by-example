import Phaser from "phaser";
import Player from "../gameobjects/player";

import {
  NEW_PLAYER,
  CURRENT_PLAYERS,
  PLAYER_DISCONNECTED,
  PLAYER_MOVED,
  PLAYER_IS_MOVING,
} from "../status";

export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: "game" });
  }

  create() {
    this.id = null;

    this.startSockets();
    this.loadAudios();
    this.addColliders();
  }

  /*
This is where the connection with the server is established and we set listeners for events that we will receive from that server. Through those listeners, we will be aware of new players, player movement and player destroy events. We need to add that `.bind(this)` to this event callback to make the elements of this class reachable. In this case, we separate the group of enemies in a hash and their physical group with `this.enemyPlayers` to set the collisions. But we could just use the physical group.
*/
  startSockets() {
    this.socket = io();
    this.addPlayer();
    this.enemies = {};
    this.enemyPlayers = this.physics.add.group();

    this.socket.on(
      NEW_PLAYER,
      function (playerInfo) {
        this.addEnemyPlayers(playerInfo);
      }.bind(this)
    );

    this.socket.on(
      CURRENT_PLAYERS,
      function (players) {
        Object.keys(players).forEach((key) => {
          if (!this.enemies[key] && key !== this.player.key)
            this.addEnemyPlayers(players[key]);
        });
      }.bind(this)
    );

    this.socket.on(
      PLAYER_MOVED,
      function (playerInfo) {
        const [name, key] = playerInfo.name.split(":");
        if (this.enemies[key]) {
          this.enemies[key].setRotation(playerInfo.rotation);
          this.enemies[key].setPosition(playerInfo.x, playerInfo.y);
        }
      }.bind(this)
    );

    this.socket.on(
      PLAYER_DISCONNECTED,
      function (key) {
        this.enemyPlayers.getChildren().forEach(function (otherPlayer) {
          if (key === otherPlayer.key) {
            otherPlayer.destroy();
          }
        });
      }.bind(this)
    );
  }

  /*
When a new enemy event is received, we'll add this new game object to this player's screen.
*/
  addEnemyPlayers(enemyPlayer) {
    const [name, key] = enemyPlayer.name.split(":");
    console.log("Adding enemy player! ", enemyPlayer.name, " Against ", key);
    const enemy = new Player(
      this,
      enemyPlayer.x,
      enemyPlayer.y,
      enemyPlayer.name
    );
    this.enemies[enemy.key] = enemy;
    this.enemyPlayers.add(enemy);
  }

  /*
When we add our local player to the game, we must notify the server about it! We are setting a generic game here, but we could add a custom name from a website.
*/
  addPlayer() {
    this.thrust = this.add.layer();
    const x = 600 + Phaser.Math.Between(-100, 100);
    const y = 500 + Phaser.Math.Between(-100, 100);
    this.player = new Player(this, x, y, "MyName:" + crypto.randomUUID());
    console.log("Creating player! ", this.player.key);
    this.socket.emit(NEW_PLAYER, this.player);
    this.setCamera();
  }

  setCamera() {
    this.cameras.main.setBackgroundColor(0xcccccc);
    this.cameras.main.startFollow(this.player, true, 0.05, 0.05, 0, 100);
  }

  /*
This is the only collider in this simplified game. If the player hits any other ship, both ships will be destroyed.
*/
  addColliders() {
    this.physics.add.overlap(
      this.player,
      this.enemyPlayers,
      this.playerCollision.bind(this)
    );
  }

  playerCollision(player, foe) {
    console.log("Collision! ");
    this.socket.emit(PLAYER_DISCONNECTED, player.key);
    player.destroy();
    foe.destroy();
  }

  /*
In the game loop, we check if the player position has changed. If it has, we notify the server about it, so other players can reproduce the movement.
*/
  update() {
    if (this.player) {
      const currPosition = {
        x: this.player.x,
        y: this.player.y,
        rotation: this.player.rotation,
      };
      if (
        this.player.oldPosition &&
        (currPosition.x !== this.player.oldPosition.x ||
          currPosition.y !== this.player.oldPosition.y ||
          currPosition.rotation !== this.player.oldPosition.rotation)
      ) {
        this.socket.emit(PLAYER_IS_MOVING, {
          key: this.player.key,
          ...currPosition,
        });
      }

      this.player.oldPosition = currPosition;
    }
  }

  /*
The rest of the game is same as usual.
*/
  loadAudios() {
    this.audios = {
      pick: this.sound.add("pick"),
      shot: this.sound.add("shot"),
      foeshot: this.sound.add("foeshot"),
      explosion: this.sound.add("explosion"),
      asteroid: this.sound.add("asteroid"),
    };
  }

  playAudio(key) {
    this.audios[key].play({ volume: 0.2 });
  }

  startGame() {
    if (this.theme) this.theme.stop();
    this.scene.start("game");
  }

  destroy() {
    if (this.player) this.socket.emit(PLAYER_DISCONNECTED, this.player.key);
    super.destroy();
  }
}
