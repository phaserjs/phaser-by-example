import { Scene3D } from "@enable3d/phaser-extension";
import Utils from "../gameobjects/utils";

export default class Story extends Scene3D {
  constructor() {
    super({ key: "story" });
  }

  /*
This creates the scene that shows the Story, which consists of a series of texts and videos. It can be skipped by pressing the space bar.
  */
  create() {
    this.game.sound.stopAll();
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.center_width = this.width / 2;
    this.center_height = this.height / 2;
    this.utils = new Utils(this);
    this.loadAudios();
    this.showIntro();
    this.cameras.main.setBackgroundColor(0x000000);
    this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);
  }

  /*
    If the player presses the space bar, we start the game by cutting the typing and the music.
  */
  startGame() {
    if (this.utils.typeAudio) this.utils.typeAudio.stop();
    if (this.theme) this.theme.stop();
    this.scene.start("splash");
  }

  /*
With this method, we load the music that will be played during the story. The next method loads audio files (just the type) and then we have a method to play them.
  */
  playMusic(theme = "hymn") {
    this.theme = this.sound.add(theme);
    this.theme.stop();
    this.theme.play({
      mute: false,
      volume: 0.7,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0,
    });
  }

  loadAudios() {
    this.audios = {
      type: this.sound.add("type"),
    };
  }

  playAudio(key) {
    this.audios[key].play();
  }

  /*
This is a text intro that is shown before the videos. It is typed and then removed.
  */
  showIntro() {
    let text1, text2;
    text1 = this.utils.typeText(
      " IN 1968 YURI GAGARIN DIED\nDURING A ROUTINE FLIGHT",
      "computer",
      this.center_width,
      this.center_height
    );
    this.time.delayedCall(
      5500,
      () => {
        text2 = this.utils.typeText(
          " OR SO THEY MADE US BELIEVE...",
          "computer",
          this.center_width,
          this.center_height + 100
        );
      },
      null,
      this
    );

    this.time.delayedCall(7000, () => this.playMusic(), null, this);
    this.time.delayedCall(
      10000,
      () => {
        this.utils.removeTyped([text1, text2]);
        this.aGameBy();
      },
      null,
      this
    );
  }

  /*
  This function generates the first part of the video. The programmer logo, some text and the first video.
  */
  aGameBy() {
    let text2;
    let text1 = this.utils.typeText(" A GAME BY\nPELLO", "computer", 1250, 10);
    let pelloLogo = this.add
      .image(990, 120, "pello_logo_old")
      .setScale(0.2)
      .setOrigin(0.5);
    let video = this.add.video(400, 300, "video0");

    this.time.delayedCall(
      5000,
      () => {
        this.utils.removeTyped([text1]);
        pelloLogo.destroy();
        text2 = this.utils.typeText(
          " MINIJAM #96\nFATE",
          "computer",
          1250,
          400
        );
      },
      null,
      this
    );

    this.time.delayedCall(9000, () => {
      this.utils.removeTyped([text2]);
      video.stop();
      video.destroy();
      this.tools();
    });

    video.play(true);
  }

  /*
    This is the second part of the video. It shows the tools used to create the game.
  */
  tools() {
    let text2;
    let text1 = this.utils.typeText(
      " TOOLS: PHASER AND ENABLE3D",
      "computer",
      550,
      10
    );
    let video = this.add.video(this.center_width, 500, "video1").setOrigin(0.5);

    this.time.delayedCall(
      5000,
      () => {
        this.utils.removeTyped([text1]);
        text2 = this.utils.typeText(" MY FIRST 3D GAME!", "computer", 550, 50);
      },
      null,
      this
    );

    this.time.delayedCall(9000, () => {
      this.utils.removeTyped([text2]);
      video.stop();
      video.destroy();
      this.otherTools();
    });

    video.play(true);
  }

  /*
  This is the third part of the video. It shows other tools used to create the game and the amount of coffee consumed.
  */
  otherTools() {
    let text2;
    let text1 = this.utils.typeText(
      " VSCODE, GULP, BLENDER, FFMPEG,...",
      "computer",
      550,
      500
    );
    let video = this.add.video(this.center_width, 100, "video2").setOrigin(0.5);

    this.time.delayedCall(
      5000,
      () => {
        this.utils.removeTyped([text1]);
        text2 = this.utils.typeText(
          " GAZILLIONS OF COFFEE WERE CONSUMED",
          "computer",
          550,
          600
        );
      },
      null,
      this
    );

    this.time.delayedCall(10000, () => {
      this.utils.removeTyped([text2]);
      video.stop();
      video.destroy();
      this.lastVideo();
    });

    video.play(true);
  }

  /*
Finally, another video and more credits for the music.
  */
  lastVideo() {
    let text2;
    let text1 = this.utils.typeText(
      " MUSIC: SACRED WAR, BY THE RED ARMY CHOIR",
      "computer",
      400,
      50
    );
    let video = this.add.video(this.center_width, 400, "video3").setOrigin(0.5);

    this.time.delayedCall(
      5000,
      () => {
        this.utils.removeTyped([text1]);
        text2 = this.utils.typeText(
          " EVOLUTION, BY BENSOUND",
          "computer",
          550,
          100
        );
      },
      null,
      this
    );

    this.time.delayedCall(10000, () => {
      this.utils.removeTyped([text2]);
      video.stop();
      video.destroy();
      this.explanation();
    });

    video.play(true);
  }

  /*
This is a long text that explains the story of the game. It is typed and then removed.
  */
  explanation() {
    this.tweens.add({
      targets: this.theme,
      volume: { from: 1, to: 0 },
      duration: 16000,
    });
    const text =
      " GAGARIN WAS SENT ON A SECRET MISSION\nBEYOND THE OORT CLOUD, " +
      "PROPELLED BY\nNUCLEAR DETONATIONS.\n\n
      HE HAS NOW PASSED THE FRONTIER OF\nOUR SOLAR SYSTEM\n" +
      "HIS MISSION:\nTO SET 20 PROBES AND RECOLLECT DATA
      \nFROM THE DEADLIEST STELLAR OBJECT:\n" +
      "A NEUTRINO STAR!\n\nHE HAS TO AVOID INCOMING DEBRIS
      \nAND GET AS CLOSE AS POSSIBLE TO THE STAR.\n" +
      "THAT WILL MEAN CERTAIN DEATH, BUT ALSO\nA MASSIVE ACHIEVEMENT " +
      "FOR SOVIET SCIENTISTS!\n\n" +
      "THE FATAL FATE OF GAGARIN IS NOW TIED\nTO THE GLORIOUS FATE " +
      "OF MOTHER RUSSIA...\n\n\nSPACE TO CONTINUE";
    let text1 = this.utils.typeText(text, "computer", 450, 50);
  }
}
