import Phaser from "phaser";
import Bootloader from "./bootloader";
import Outro from "./outro";
import Splash from "./splash";
import Transition from "./transition";
import Game from "./game";
import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";
import { MatterGravityFixPlugin } from "./matter_gravity_fix";

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
