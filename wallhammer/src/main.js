import Phaser from "phaser";
import Bootloader from "./scenes/bootloader";
import Game from "./scenes/game";
import Outro from "./scenes/outro";
import Splash from "./scenes/splash";
import Transition from "./scenes/transition";

const config = {
  width: 1000,
  height: 800,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  autoRound: false,
  parent: "game-container",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: true,
    },
  },
  scene: [Bootloader, Splash, Transition, Game, Outro],
};

const game = new Phaser.Game(config);
