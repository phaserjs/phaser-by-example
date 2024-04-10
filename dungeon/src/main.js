import Phaser from "phaser";
import Bootloader from "./scenes/bootloader";
import Outro from "./scenes/outro";
import Splash from "./scenes/splash";
import Transition from "./scenes/transition";
import Game from "./scenes/game";
import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";
import { MatterGravityFixPlugin } from "./plugins/matter_gravity_fix";

const config = {
  width: 600,
  height: 600,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  autoRound: false,
  parent: "contenedor",
  physics: {
    default: "matter",
    matter: {
      debug: false,
    },
  },
  plugins: {
    scene: [
      {
        plugin: PhaserMatterCollisionPlugin, // The plugin class
        key: "matterCollision", // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
        mapping: "matterCollision", // Where to store in the Scene, e.g. scene.matterCollision
      },
      {
        key: "MatterGravityFixPlugin",
        plugin: MatterGravityFixPlugin,
        mapping: "matterGravityFix",
        start: true,
      },
    ],
  },
  scene: [Bootloader, Splash, Transition, Game, Outro],
};

const game = new Phaser.Game(config);
