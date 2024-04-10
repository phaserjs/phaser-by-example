import Explosion from "./explosion";
import { LightParticle } from "./particle";
import ShootingPatterns from "./shooting_patterns";

class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, name = "player1", powerUp = "water") {
    super(scene, x, y, name);
    this.name = name;
    this.spawnShadow(x, y);
    this.powerUp = powerUp;
    this.id = Math.random();
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setCollideWorldBounds(true);
    this.body.setAllowGravity(false);
    this.body.setCircle(26);
    this.body.setOffset(6, 9);
    this.power = 0;
    this.blinking = false;
    this.shootingPatterns = new ShootingPatterns(this.scene, this.name);
    this.init();
    this.setControls();
  }

  /*
    We add a shadow to the player, and we'll have to update its position with the player. Alternatively, we could have defined a Container with the player and the shadow.
    */
  spawnShadow(x, y) {
    this.shadow = this.scene.add
      .image(x + 20, y + 20, "player1")
      .setTint(0x000000)
      .setAlpha(0.4);
  }

  /*
    We set the animations for the player. We'll have 3 animations: one for the idle state, one for moving right, and one for moving left.
    */
  init() {
    this.scene.anims.create({
      key: this.name,
      frames: this.scene.anims.generateFrameNumbers(this.name, {
        start: 0,
        end: 0,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.scene.anims.create({
      key: this.name + "right",
      frames: this.scene.anims.generateFrameNumbers(this.name, {
        start: 1,
        end: 1,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.scene.anims.create({
      key: this.name + "left",
      frames: this.scene.anims.generateFrameNumbers(this.name, {
        start: 2,
        end: 2,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.play(this.name, true);

    this.upDelta = 0;
  }

  /*
    We set the controls for the player. We'll use the cursor keys and WASD keys to move the player, and the space bar to shoot.
    */
  setControls() {
    this.SPACE = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.cursor = this.scene.input.keyboard.createCursorKeys();
    this.W = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.A = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.S = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.D = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  }

  /*
    This will be called when the player shoots. We'll play a sound, and then call the shoot method of the current shooting pattern.
    */
  shoot() {
    this.scene.playAudio("shot");
    this.shootingPatterns.shoot(this.x, this.y, this.powerUp);
  }

  /*
    This is the game loop for the player. We'll check if the player is moving, and if so, we'll play the corresponding animation. We'll also check if the player is shooting, and if so, we'll call the shoot method.
    */
  update(timestep, delta) {
    if (this.death) return;
    if (this.cursor.left.isDown) {
      this.x -= 5;
      this.anims.play(this.name + "left", true);
      this.shadow.setScale(0.5, 1);
    } else if (this.cursor.right.isDown) {
      this.x += 5;
      this.anims.play(this.name + "right", true);
      this.shadow.setScale(0.5, 1);
    } else {
      this.anims.play(this.name, true);
      this.shadow.setScale(1, 1);
    }

    if (this.cursor.up.isDown) {
      this.y -= 5;
    } else if (this.cursor.down.isDown) {
      this.y += 5;
    }

    if (Phaser.Input.Keyboard.JustDown(this.SPACE)) {
      this.shoot();
    }
    this.scene.trailLayer.add(
      new LightParticle(this.scene, this.x, this.y, 0xffffff, 10)
    );
    this.updateShadow();
  }

  /*
    We update the shadow position to follow the player.
    */
  updateShadow() {
    this.shadow.x = this.x + 20;
    this.shadow.y = this.y + 20;
  }

  /*
    Every time the player destroys a foe or a shot we show the points. We'll use a bitmap text for that.
    */
  showPoints(score, color = 0xff0000) {
    let text = this.scene.add
      .bitmapText(this.x + 20, this.y - 30, "starshipped", score, 20, 0xfffd37)
      .setOrigin(0.5);
    this.scene.tweens.add({
      targets: text,
      duration: 2000,
      alpha: { from: 1, to: 0 },
      y: { from: text.y - 10, to: text.y - 100 },
    });
  }

  /*
    This will be called when the player dies: we'll show an explosion, shake the camera, and destroy the player.
    */
  dead() {
    const explosion = this.scene.add
      .circle(this.x, this.y, 10)
      .setStrokeStyle(40, 0xffffff);
    this.scene.tweens.add({
      targets: explosion,
      radius: { from: 10, to: 512 },
      alpha: { from: 1, to: 0.3 },
      duration: 300,
      onComplete: () => {
        explosion.destroy();
      },
    });
    this.scene.cameras.main.shake(500);
    this.death = true;
    this.shadow.destroy();
    new Explosion(this.scene, this.x, this.y, 40);
    super.destroy();
  }
}

export default Player;
