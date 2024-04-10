import Phaser from "phaser";
import Game from "./scenes/game";
import Bootloader from "./scenes/bootloader";

const config = {
  type: Phaser.AUTO,
  useTicker: true,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: "phaser-example",
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 868,
    height: 800,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [Bootloader, Game],
};

new Phaser.Game(config);
