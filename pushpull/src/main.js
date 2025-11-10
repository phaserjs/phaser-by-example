import Phaser from "phaser";
import Bootloader from "./scenes/bootloader";
import Game from "./scenes/game";
import Outro from "./scenes/outro";
import Splash from "./scenes/splash";
import Transition from "./scenes/transition";

const config = {
  width: 608,
  height: 608,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  autoRound: false,
  parent: "game-container",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  plugins: {},
  scene: [Bootloader, Splash, Transition, Game, Outro],
};

const game = new Phaser.Game(config);
