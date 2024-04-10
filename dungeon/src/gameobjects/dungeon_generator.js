import Dungeon from "@mikewesthad/dungeon";
import Coin from "./coin";
import Key from "./key";
import Bat from "./bat";
import Wizard from "./wizard";
import SeeSaw from "./seesaw";

export default class DungeonGenerator {
  constructor(scene) {
    this.scene = scene;
    this.generate();
  }

  /*
    This is the method that generates the whole dungeon. It's divided into different methods to make it more readable but basically, it generates the dungeon, and the map and then it places the different elements on the map.
  */
  generate() {
    this.generateDungeon();
    this.generateMap();
    // Watch the player and layer for collisions, for the duration of the scene:
    //this.physics.add.collider(this.player.sprite, layer);

    this.dungeon.rooms.forEach((room) => {
      // These room properties are all in grid units (not pixels units)
      const { x, y, width, height } = room;
      // Fill the room (minus the walls) with mostly clean floor tiles (90% of the time), but
      // occasionally place a dirty tile (10% of the time).
      this.groundLayer.weightedRandomize(
        [
          { index: 17, weight: 9 }, // 9/10 times, use index 6
          { index: [7, 8, 9, 17, 18, 19], weight: 1 }, // 1/10 times, randomly pick 7, 8 or 26
        ],
        x + 1,
        y + 1,
        width - 2,
        height - 2
      );

      this.placeCorners(room);
      this.placeWalls(room);

      const doors = room.getDoorLocations(); // Returns an array of {x, y} objects
      this.addDoors(room, doors, x, y);
      this.addKey(room);
      this.addFoes(room);
      this.addCoins(room);
      this.addSeeSaw(room);
    });
  }

  /*
    This method generates the dungeon using the dungeon generator library. We just need to pass the width and height of the dungeon and some options. You can check the documentation of the library to see all the options available.
  */
  generateDungeon() {
    this.dungeon = new Dungeon({
      width: 50,
      height: 50,
      doorPadding: 2,
      rooms: {
        width: { min: 7, max: 15 },
        height: { min: 7, max: 15 },
        maxRooms: 12,
      },
    });
  }

  /*
    This method adds a specific tilemap to our dungeon, with its layers and collisions.
  */
  generateMap() {
    this.map = this.scene.make.tilemap({
      tileWidth: 48,
      tileHeight: 48,
      width: this.dungeon.width,
      height: this.dungeon.height,
    });
    const tileset = this.map.addTilesetImage("tiles", null, 48, 48, 0, 0); // 1px margin, 2px spacing
    this.groundLayer = this.map.createBlankLayer("Layer 1", tileset);
    this.stuffLayer = this.map.createBlankLayer("Stuff", tileset);

    // Get a 2D array of tile indices (using -1 to not render empty tiles) and place them into the
    // blank layer
    const mappedTiles = this.dungeon.getMappedTiles({
      empty: -1,
      floor: -1,
      door: 3,
      wall: 0,
    });
    this.groundLayer.putTilesAt(mappedTiles, 0, 0);
    this.groundLayer.setCollision(0);
    this.groundLayer.setCollisionByProperty({ collides: true });
    this.scene.matter.world.convertTilemapLayer(this.groundLayer);
  }

  /*
    This method places the corners of the room. We use the tile index to place the corner tiles.
  */
  placeCorners(room) {
    const { left, right, top, bottom } = room;
    this.groundLayer.putTileAt(0, left, top);
    this.groundLayer.putTileAt(5, right, top);
    this.groundLayer.putTileAt(45, right, bottom);
    this.groundLayer.putTileAt(40, left, bottom);
  }

  /*
    This method places the walls of the room. We use the tile index to place the wall tiles. It uses a weighted randomize method to place the tiles which means that we can give more weight (frequency) to some tiles than others.
  */
  placeWalls(room) {
    const { width, height, left, right, top, bottom } = room;
    this.groundLayer.weightedRandomize(
      [
        { index: 2, weight: 4 },
        { index: [1, 2, 3, 4], weight: 1 },
      ],
      left + 1,
      top,
      width - 2,
      1
    );
    this.groundLayer.weightedRandomize(
      [
        { index: 42, weight: 4 },
        { index: [41, 42, 43, 44], weight: 1 },
      ],
      left + 1,
      bottom,
      width - 2,
      1
    );
    this.groundLayer.weightedRandomize(
      [
        { index: 10, weight: 4 },
        { index: [10, 20, 30], weight: 1 },
      ],
      left,
      top + 1,
      1,
      height - 2
    );
    this.groundLayer.weightedRandomize(
      [
        { index: 15, weight: 4 },
        { index: [15, 25, 35], weight: 1 },
      ],
      right,
      top + 1,
      1,
      height - 2
    );
  }

  /*
    As the name implies, this one adds the doors to the room. We use the tile index to place the door tiles.
  */
  addDoors(room, doors, x, y) {
    for (let i = 0; i < doors.length; i++) {
      const worldPosition = this.groundLayer.tileToWorldXY(
        x + doors[i].x,
        y + doors[i].y
      );
      new Coin(this.scene, worldPosition.x + 20, worldPosition.y + 20);
      if (doors[i].y === 0) {
        this.groundLayer.putTilesAt([[7], [7]], x + doors[i].x, y + doors[i].y);
      } else if (doors[i].y === room.height - 1) {
        this.groundLayer.putTilesAt([[7], [7]], x + doors[i].x, y + doors[i].y);
      } else if (doors[i].x === 0) {
        this.groundLayer.putTilesAt([[7]], x + doors[i].x, y + doors[i].y);
      } else if (doors[i].x === room.width - 1) {
        this.groundLayer.putTilesAt([[7]], x + doors[i].x, y + doors[i].y);
      }
    }
  }

  /*
    Each room must have a key that the player has to collect. This method adds the key to the room.
  */
  addKey(room) {
    const keyX = Phaser.Math.Between(room.left + 2, room.right - 2);
    const keyY = Phaser.Math.Between(room.top + 2, room.bottom - 2);
    const worldPosition = this.groundLayer.tileToWorldXY(keyX, keyY);
    new Key(this.scene, worldPosition.x + 22, worldPosition.y + 22);
  }

  /*
    Randomly, some rooms may have a seesaw. This method adds the seesaw to the center of the room.
  */
  addSeeSaw(room) {
    if (Phaser.Math.Between(0, 10) < 7) return;
    const worldPosition = this.groundLayer.tileToWorldXY(
      room.centerX,
      room.centerY
    );
    new SeeSaw(
      this.scene,
      worldPosition.x + 22,
      worldPosition.y + 22,
      room.width
    );
  }

  /*
    Coins are randomly placed in the room. We use a random method to decide where to place the coins. It uses other helper methods to place the coins in different positions.
  */
  addCoins(room) {
    const where = Phaser.Math.RND.pick([
      "top",
      "bottom",
      "left",
      "right",
      "none",
    ]);
    const width = parseInt(room.width / 3) - Phaser.Math.Between(1, 2);
    const height = parseInt(room.height / 3) - Phaser.Math.Between(1, 2);
    switch (where) {
      case "top":
        this.addCoinsTop(room, width, height);
        break;
      case "bottom":
        this.addCoinsdBottom(room, width, height);
        break;
      case "left":
        this.addCoinsdLeft(room, width, height);
        break;
      case "right":
        this.addCoinsdRight(room, width, height);
        break;
      default:
        break;
    }
  }

  addCoinsTop(room, width, height) {
    const keyY = room.top + Phaser.Math.Between(1, 2);
    const keyX = room.left + Phaser.Math.Between(1, 2);

    Array(width)
      .fill()
      .forEach((x, i) => {
        Array(height)
          .fill()
          .forEach((y, j) => {
            const worldPosition = this.groundLayer.tileToWorldXY(
              keyX + i,
              keyY + j
            );
            new Coin(this.scene, worldPosition.x + 20, worldPosition.y + 20);
          });
      });
  }

  addCoinsdBottom(room, width, height) {
    const keyY = room.bottom - Phaser.Math.Between(1, 2);
    const keyX = room.left + Phaser.Math.Between(1, 2);

    Array(width)
      .fill()
      .forEach((x, i) => {
        Array(height)
          .fill()
          .forEach((y, j) => {
            const worldPosition = this.groundLayer.tileToWorldXY(
              keyX + i,
              keyY - j
            );
            new Coin(this.scene, worldPosition.x + 20, worldPosition.y + 20);
          });
      });
  }

  addCoinsdLeft(room, width, height) {
    const keyY = room.top + Phaser.Math.Between(3, 4);
    const keyX = room.left + Phaser.Math.Between(1, 2);

    Array(width)
      .fill()
      .forEach((x, i) => {
        Array(height)
          .fill()
          .forEach((y, j) => {
            const worldPosition = this.groundLayer.tileToWorldXY(
              keyX + i,
              keyY - j
            );
            new Coin(this.scene, worldPosition.x + 20, worldPosition.y + 20);
          });
      });
  }

  addCoinsdRight(room, width, height) {
    const keyY = room.top + Phaser.Math.Between(1, 2);
    const keyX = room.right - Phaser.Math.Between(3, 4);

    Array(width)
      .fill()
      .forEach((x, i) => {
        Array(height)
          .fill()
          .forEach((y, j) => {
            const worldPosition = this.groundLayer.tileToWorldXY(
              keyX - i,
              keyY + j
            );
            new Coin(this.scene, worldPosition.x + 20, worldPosition.y + 20);
          });
      });
  }

  addFoes(room) {
    const keyX = Phaser.Math.Between(room.left + 2, room.right - 2);
    const keyY = Phaser.Math.Between(room.top + 2, room.bottom - 2);

    const worldPosition = this.groundLayer.tileToWorldXY(keyX, keyY);

    if (Phaser.Math.Between(0, 5) > 4) {
      new Wizard(
        this.scene,
        worldPosition.x + 22,
        worldPosition.y + 22,
        this.groundLayer
      );
    } else {
      new Bat(
        this.scene,
        worldPosition.x + 22,
        worldPosition.y + 22,
        this.groundLayer
      );
    }
  }

  /*
    This one adds the top traps or spikes to the room. Finally is not used in the game but it's a good example of how to add more elements to the dungeon.
  */
  addTopTraps(room) {
    const { x, y, width, height, left, right, top, bottom, tiles } = room;

    const topTiles = tiles[0];
    topTiles.forEach((tile, i) => {
      if (tile === 1 && i > 0 && i < right)
        this.groundLayer.putTileAt(5, i + left, top + 1);
    });
  }
}
