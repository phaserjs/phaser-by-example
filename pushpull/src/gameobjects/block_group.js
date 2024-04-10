import Block from "./block";

export default class BlockGroup extends Phaser.GameObjects.Container {
  constructor(
    scene,
    x,
    y,
    w = 2,
    h = 3,
    color = "blue",
    defaultVelocity = 100
  ) {
    super(scene, x, y);
    this.w = +w;
    this.h = +h;
    this.id = Math.random();
    this.name = "block_" + color;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.body.immovable = true;
    this.active = false;
    this.setKeys();
    this.defaultVelocity = defaultVelocity;
    this.createBlock();
    this.allowChangeDirection = true;
    this.scene.events.on("update", this.update, this);
    this.setListeners();
  }

  /*
  This method creates the block group based on the size.
  */
  createBlock() {
    this.body.setSize(this.w * 32, this.h * 32);

    for (let i = 0; i < this.w; i++) {
      for (let j = 0; j < this.h; j++) {
        this.add(new Block(this.scene, i * 32, j * 32, this.name));
      }
    }
  }

  /*
  This method sets the keys to move the block group.
  */
  setKeys() {
    this.cursor = this.scene.input.keyboard.createCursorKeys();
    this.W = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.A = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.S = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.D = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.scene.events.on("update", this.update, this);
  }

  /*
  This method sets the listeners for the mouse to select blocks. When a block is selected, it becomes the active block. We add some color to it with `setTint` so the player knows which block is active.
  */
  setListeners() {
    this.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, 64, 96),
      Phaser.Geom.Rectangle.Contains
    );
    this.on("pointerdown", (pointer) => {
      this.scene.playAudio("select");
      this.iterate((block) => block.setTint(0x306070));
      this.activate();
    });

    this.on("pointerover", () => {
      this.scene.playAudio("hover");
      this.iterate((block) => block.setTint(0x306070));
    });

    this.on("pointerout", () => {
      this.iterate((block) => block.clearTint());
    });
  }

  /*
  This method activates the block group. It also deactivates the previous active block. The next method does the opposite.
  */
  activate() {
    if (this.scene.activeBlock) this.scene.activeBlock.deactivate();
    this.active = true;
    this.scene.activeBlock = this;
  }

  deactivate() {
    this.active = false;
  }

  /*
  This method is the game loop for the block group. It detects what key was pressed and it checks if the block group can move in the direction of the key pressed. If it can, it moves the block group and updates the number of moves.
  */
  update() {
    if (!this.active) return;
    if (
      (Phaser.Input.Keyboard.JustUp(this.S) ||
        Phaser.Input.Keyboard.JustUp(this.cursor.down)) &&
      this.canMoveDown()
    ) {
      this.leaveTrail(this.w * 32, 32);
      this.y += 32;
      this.scene.updateMoves();
    } else if (
      (Phaser.Input.Keyboard.JustUp(this.W) ||
        Phaser.Input.Keyboard.JustUp(this.cursor.up)) &&
      this.canMoveUp()
    ) {
      this.leaveTrail(this.w * 32, 32, 0, (this.h - 1) * 32);
      this.y -= 32;
      this.scene.updateMoves();
    } else if (
      (Phaser.Input.Keyboard.JustUp(this.D) ||
        Phaser.Input.Keyboard.JustUp(this.cursor.right)) &&
      this.canMoveRight()
    ) {
      this.leaveTrail(32, this.h * 32);
      this.x += 32;
      this.scene.updateMoves();
    } else if (
      (Phaser.Input.Keyboard.JustUp(this.A) ||
        Phaser.Input.Keyboard.JustUp(this.cursor.left)) &&
      this.canMoveLeft()
    ) {
      this.leaveTrail(32, this.h * 32, (this.w - 1) * 32);
      this.x -= 32;
      this.scene.updateMoves();
    }
  }

  /*
  This method leaves a trail behind the block group. It is used when the block group moves.
  */
  leaveTrail(w, h, offsetX = 0, offsetY = 0) {
    this.scene.playAudio("move");
    const trail = this.scene.add
      .rectangle(this.x + offsetX, this.y + offsetY, w, h, 0xcccccc)
      .setOrigin(0);
    this.scene.tweens.add({
      targets: [trail],
      duration: 300,
      alpha: { from: 1, to: 0 },
      onComplete: () => {
        trail.destroy();
      },
    });
  }

  /*
    This method checks if the block group overlaps with another block group. It is used to check if the block group can move in a certain direction.
  */
  isOverlap(x = 0, y = 0) {
    const overlaps = this.scene.blocks.children.entries.map((block) => {
      if (block.id === this.id) return false;

      let myBounds = this.getBounds();
      let otherBounds = block.getBounds();
      myBounds.x += 1;
      myBounds.y += 1;
      myBounds.width = this.w * 32 - 2;
      myBounds.height = this.h * 32 - 2;
      myBounds.x += x;
      myBounds.y += y;
      const intersect = Phaser.Geom.Intersects.RectangleToRectangle(
        myBounds,
        otherBounds
      );
      return intersect;
    });
    return !overlaps.every((block) => !block);
  }

  /*
    This specific method checks if the block group can move down. It is used by the `update` method.
  */
  canMoveDown(distance = 32) {
    if (this.isOverlap(0, 1)) {
      this.scene.playAudio("bump");
      return false;
    }
    distance = this.h * 32;

    const blocks = Array(this.w)
      .fill(0)
      .map((_, i) => {
        return this.scene.platform.getTileAtWorldXY(
          this.x + i * 32,
          this.y + distance
        );
      });

    const canMove = blocks.every((block) => !block);
    if (!canMove) {
      this.scene.playAudio("bump");
    }
    return canMove;
  }

  /*
    Same as before, but this time it checks if the block group can move up.
  */
  canMoveUp(distance = 32) {
    if (this.isOverlap(0, -1)) {
      this.scene.playAudio("bump");
      return false;
    }
    const blocks = Array(this.w)
      .fill(0)
      .map((_, i) => {
        return this.scene.platform.getTileAtWorldXY(
          this.x + i * 32,
          this.y - 1
        );
      });

    const canMove = blocks.every((block) => !block);
    if (!canMove) {
      this.scene.playAudio("bump");
    }
    return canMove;
  }

  /*
    Same as before, but here it checks if the block group can move left.
  */
  canMoveLeft(distance = 32) {
    if (this.isOverlap(-1, 0)) {
      this.scene.playAudio("bump");
      return false;
    }

    const blocks = Array(this.h)
      .fill(0)
      .map((_, i) => {
        return this.scene.platform.getTileAtWorldXY(
          this.x - distance,
          this.y + i * 32
        );
      });

    const canMove = blocks.every((block) => !block);
    if (!canMove) {
      this.scene.playAudio("bump");
    }
    return canMove;
  }

  /*
    ... and right.
  */
  canMoveRight(distance = 32) {
    if (this.isOverlap(1, 0)) {
      this.scene.playAudio("bump");
      return false;
    }
    distance = this.w * 32;
    const blocks = Array(this.h)
      .fill(0)
      .map((_, i) => {
        return this.scene.platform.getTileAtWorldXY(
          this.x + distance,
          this.y + i * 32
        );
      });
    const canMove = blocks.every((block) => !block);
    if (!canMove) {
      this.scene.playAudio("bump");
    }
    return canMove;
  }
}
