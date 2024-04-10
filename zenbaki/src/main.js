import Phaser from "phaser";
import Bootloader from "./scenes/bootloader";
import Game from "./scenes/game";

const config = {
  width: 260,
  height: 380,
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  autoRound: false,
  parent: "contenedor",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: [Bootloader, Game],
};

const game = new Phaser.Game(config);
