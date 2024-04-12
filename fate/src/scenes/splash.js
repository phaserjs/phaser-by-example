import { Scene3D } from "@enable3d/phaser-extension";
import Utils from "../gameobjects/utils";

export default class Splash extends Scene3D {
  constructor() {
    super({ key: "splash" });
  }

  /*
This will create the elements of the Splash screen. This screen is a normal scene that is shown before the game starts. It shows the logo and the basic instructions.
  */
  create() {
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.center_width = this.width / 2;
    this.center_height = this.height / 2;
    this.utils = new Utils(this);
    this.showLogo();
    this.showInstructions();
    this.input.keyboard.on("keydown-SPACE", () => this.loadNext(), this);
    this.playMusic();
  }

  /*
    We use this method to play the music. In this game, the music theme starts in the Splash screen and it is played during the game.
    */
  playMusic(theme = "music") {
    this.theme = this.sound.add(theme);
    this.theme.stop();
    this.theme.play({
      mute: false,
      volume: 0.5,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0,
    });
  }

  /*
This is just the "logo" of the game, which is just a text.
  */
  showLogo() {
    this.logo = this.add
      .image(this.center_width, 170, "logo")
      .setOrigin(0.5)
      .setScale(0.7)
      .setAlpha(0);
    this.tweens.add({
      targets: this.logo,
      duration: 3000,
      alpha: { from: 0, to: 1 },
    });
  }

  /*
These are the instructions for the game. We use again the Utils class to show the text letter by letter.
  */
  showInstructions() {
    let text1, text2;
    text1 = this.utils.typeText(
      "ARROWS + W + S\nMOUSE FOR POV\n",
      "computer",
      this.center_width + 190,
      this.center_height
    );
    this.time.delayedCall(
      2000,
      () => {
        text2 = this.utils.typeText(
          " PRESS SPACE",
          "computer",
          this.center_width + 190,
          this.center_height + 100
        );
      },
      null,
      this
    );

    this.time.delayedCall(
      4000,
      () => {
        let text3 = this.utils.typeText(
          " A GAME BY PELLO",
          "computer",
          this.center_width + 140,
          this.center_height + 200
        );
        let pelloLogo = this.add
          .image(this.center_width, this.center_height + 300, "pello_logo_old")
          .setScale(0.2)
          .setOrigin(0.5);
      },
      null,
      this
    );
  }

  /*
    This is the method that will start the game.
    */
  loadNext() {
    if (this.utils.typeAudio) this.utils.typeAudio.stop();
    this.scene.start("game");
  }
}
