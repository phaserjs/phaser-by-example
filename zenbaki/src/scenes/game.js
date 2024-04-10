import Player from "../gameobjects/player";
import Chat from "../chat";

export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: "game" });
    this.player = null;
    this.score = 0;
    this.scoreText = null;
    this.nextOperator = "";
    this.lastMessage = null;
    this.number = "";
    this.counter = 0;
    this.failed = false;
  }

  /*
We use preload in this case only to get the background color from the URL parameters. We could also get the foreground color, but we will use the default one if it's not specified.
We also calculate the first result.
  */
  preload() {
    const urlParams = new URLSearchParams(window.location.search);
    let parambg = urlParams.get("background") || "#00b140";
    parambg = parseInt(parambg.substring(1), 16);
    this.backgroundColor = "0x" + parambg.toString(16);

    let paramfg = urlParams.get("foreground") || "#F0EAD6";
    paramfg = parseInt(paramfg.substring(1), 16);
    this.foregroundColor = "0x" + paramfg.toString(16);

    this.spamTimeWait = 2;
    this.result = Phaser.Math.Between(1, 9);
  }

  /*
We create the elements of the game. This one is quite simple. We just create the chat, and the UI and load the audio files.
  */
  create() {
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.center_width = this.width / 2;
    this.center_height = this.height / 2;
    this.cameras.main.setBackgroundColor(+this.foregroundColor);
    this.allPlayers = {};

    this.addChat();
    this.loadAudios();
    this.addUI();
  }

  /*
    This creates an instance of the chat client and allows us to receive messages from the chat.
  */
  addChat() {
    this.chat = new Chat(this);
  }

  /*
This is called from the chat when the connection is ready. We will create the next operation when the game is connected to the chat channel.
*/
  loadGame() {
    this.generateNextOperation();
  }

  /*
The game has a very simple interface. We just show the current number, the next operation and the score. Also, we add some clouds to make it look nicer.
  */
  addUI() {
    this.circle = this.add.circle(
      this.center_width,
      this.center_height - 50,
      100,
      0xf22c2e
    );
    this.numberText = this.add
      .bitmapText(
        this.center_width,
        this.center_height - 50,
        "mainFont",
        this.number,
        120
      )
      .setOrigin(0.5)
      .setTint(0x000000);
    this.operatorText = this.add
      .bitmapText(
        this.center_width,
        this.center_height + 80,
        "mainFont",
        `${this.nextOperator}${this.number}`,
        50
      )
      .setOrigin(0.5)
      .setTint(0x000000);
    this.addClouds();
    this.addScore();
    this.byText = this.add
      .bitmapText(
        this.center_width,
        this.height - 10,
        "mainFont",
        "by Pello",
        10
      )
      .setOrigin(0.5)
      .setTint(0x000000);
  }

  /*
This is the function that will generate random clouds and move them across the screen. We use tweens to move them and destroy them when they are out of the screen. Then we call the function again to generate new clouds.
  */
  addClouds() {
    this.cloudLeft = this.add
      .image(
        this.center_width - 100,
        this.center_height - 120 + Phaser.Math.Between(-15, 15),
        "cloud" + Phaser.Math.Between(1, 14)
      )
      .setScale(Phaser.Math.Between(5, 9) * 0.1);
    this.cloudRight = this.add
      .image(
        this.center_width + 100,
        this.center_height + 30 + Phaser.Math.Between(-15, 15),
        "cloud" + Phaser.Math.Between(1, 14)
      )
      .setScale(Phaser.Math.Between(4, 6) * 0.1);
    this.tweens.add({
      targets: [this.cloudLeft],
      x: { from: -156, to: this.width + 156 },
      duration: 30000,
      onComplete: () => {
        this.cloudLeft.destroy();
      },
    });

    this.tweens.add({
      targets: this.cloudRight,
      x: { from: this.width + 156, to: -156 },
      duration: 30000,
      onComplete: () => {
        this.cloudLeft.destroy();
        this.addClouds();
      },
    });
  }

  /*
This is the function that will show the score. We will show the top 3 players and the score of the current player.
  */
  addScore() {
    const scoreBoard = this.createScoreBoard();
    this.add
      .bitmapText(this.center_width, 25, "mainFont", "zenbaki", 25)
      .setOrigin(0.5)
      .setTint(0x000000);
    scoreBoard.slice(0, 3).forEach((player, i) => {
      const winnerText = `${i + 1}.  ${player.name}: ${player.score}`;
      this.add
        .bitmapText(this.center_width, 100 + i * 50, "mainFont", winnerText, 30)
        .setOrigin(0.5)
        .setTint(this.foregroundColor)
        .setDropShadow(1, 2, 0xbf2522, 0.7);
    });

    this.scoreText1 = this.add
      .bitmapText(
        this.center_width,
        this.center_height + 130,
        "mainFont",
        "",
        20
      )
      .setOrigin(0.5)
      .setTint(0x000000);
    this.scoreText2 = this.add
      .bitmapText(
        this.center_width,
        this.center_height + 160,
        "mainFont",
        "",
        25
      )
      .setOrigin(0.5)
      .setTint(0x000000);
  }

  /*
When a new player tries to guess or joins the channel, we'll add it to `allPlayers` array. If the player already exists, we'll return the existing player.
  */
  addPlayer(name) {
    if (this.allPlayers[name]) return this.allPlayers[name];
    const player = new Player(this, name);
    this.allPlayers[name] = player;
    this.chat.say(`Player ${name} joins game!`);
    return player;
  }

  /*
This is the function that will be called when a player tries to guess the number. We will check if the player exists and if it does, we will check if the player has spammed the chat. If it hasn't, we will check if the number is correct. If it is, we will add the score to the player and generate a new operation. If it's not, we will penalize the player and show a message.
  */
  guess(playerName, number) {
    if (this.failed) return;
    console.log("Game> guess: ", playerName, number);

    const player = this.addPlayer(playerName);
    if (player.dead) return;
    if (player.hasSpammed()) return;
    player.lastMessage = new Date();

    console.log("Game> guess go on: ", playerName, number);

    if (this.result === parseInt(number)) {
      const score = this.calculateScore();
      player.score += score;
      this.showScore(playerName, score);
      this.generateNextOperation();
      console.log("Player", playerName, "guess", number);
    } else if (this.number === parseInt(number)) {
      console.log("Player, ", playerName, " is too slow");
    } else {
      this.cameras.main.shake(100, 0.01);
      this.playAudio("fail");
      this.failed = true;
      player.setPenalty();
      this.showShame(playerName);
      this.chat.say(`Player ${playerName} failed! Shame on you!`);
    }
  }

  /*
These are the points that we will add to the player score depending on the operator. We will add 1 point for `+`, 2 for `-`, 4 for `*` and 5 for `/`.
  */
  calculateScore() {
    const operatorPoints = { "+": 1, "-": 2, "*": 4, "/": 5 };
    return this.counter + operatorPoints[this.nextOperator];
  }

  /*
We use the `loadAudio`/`playAudios` mechanism again:
  */
  loadAudios() {
    this.audios = {
      win: this.sound.add("win"),
      drip: this.sound.add("drip"),
      fail: this.sound.add("fail"),
    };
  }

  playAudio(key) {
    this.audios[key].play({
      volume: 0.5,
    });
  }

  /*
This will show the result of the game. We will show the top 5 players and the score of the current player.
  */
  showResult() {
    const scoreBoard = this.createScoreBoard();
    this.scoreRectangle = this.add
      .rectangle(0, 0, this.width, this.height, this.foregroundColor, 0.9)
      .setOrigin(0, 0);
    this.scores = this.add.group();
    this.sensei = this.add
      .image(this.center_width, this.height - 60, "sensei")
      .setOrigin(0.5)
      .setScale(0.4);
    this.scores.add(this.sensei);
    this.scores.add(
      this.add
        .bitmapText(this.center_width, 60, "mainFont", "Senseis:", 30)
        .setOrigin(0.5)
        .setTint(0x000000)
    );
    scoreBoard.slice(0, 5).forEach((player, i) => {
      const winnerText = `${i + 1}.  ${player.name}, ${player.score}`;
      this.scores.add(
        this.add
          .bitmapText(
            this.center_width,
            100 + i * 20,
            "mainFont",
            winnerText,
            15
          )
          .setOrigin(0.5)
          .setTint(0x000000)
      );
    });

    this.removeResult();
  }

  /*
Once we show the result, we will remove it after 5 seconds.
    */
  removeResult() {
    this.time.delayedCall(
      5000,
      () => {
        this.tweens.add({
          targets: [this.scoreRectangle, this.scores, this.sensei],
          duration: 1000,
          alpha: { from: 1, to: 0 },
          onComplete: () => {
            this.scoreRectangle.destroy();
            this.scores.getChildren().forEach(function (child) {
              child.destroy();
            }, this);
            this.scores.clear(true, true);
          },
        });
        this.resetScore();
        this.generateNextOperation();
      },
      null,
      this
    );
  }

  /*
This will order the players by score.
  */
  createScoreBoard() {
    return [...Object.values(this.allPlayers)].sort(
      (player1, player2) => player2.score - player1.score
    );
  }

  /*
This will reset the score and the counter and will set the failed flag to false.
  */
  resetScore() {
    this.number = 0;
    this.counter = 0;
    this.failed = false;
  }

  /*
We'll call this function to generate the next operation. We will increase the counter, set the number to the result, generate a new operand and a new operator and calculate the result.
  */
  generateNextOperation() {
    this.counter++;
    this.number = this.result;
    this.nextOperand = Phaser.Math.Between(1, 9);
    this.nextOperator = this.selectOperator();
    this.result = parseInt(
      eval(this.number + this.nextOperator + this.nextOperand)
    );
    console.log(
      "Current: ",
      this.number,
      " operator: ",
      this.nextOperator,
      " nextNumber: ",
      this.nextOperand,
      ", Result: ",
      this.result
    );
    this.showNextOperation(this.nextOperator, this.nextOperand);
    this.playAudio("drip");
  }

  /*
To select the next operator to use, we take into account the number, the next operand and the result. We will try to avoid big negative numbers and numbers bigger than 100, and also divisions that don't result in an integer.
  */
  selectOperator() {
    if (this.number % this.nextOperand === 0 && this.nextOperand !== 1) {
      return Phaser.Math.RND.pick(["+", "-", "+", "-", "/"]);
    } else if (this.number + this.nextOperand >= 100) {
      return Phaser.Math.RND.pick(["-"]);
    } else if (this.number - this.nextOperand <= -100) {
      return Phaser.Math.RND.pick(["+"]);
    } else if (Math.abs(this.number * this.nextOperand) < 100) {
      return Phaser.Math.RND.pick(["+", "-", "+", "-", "*"]);
    } else {
      return Phaser.Math.RND.pick(["+", "-", "+", "-"]);
    }
  }

  /*
If a player guesses correctly the result, we will show a message with the player's name and the score.
  */
  showScore(playerName, score) {
    this.scoreText1.setText(`Great!`).setAlpha(1);
    this.scoreText2.setText(`${playerName} +${score}`).setAlpha(1);
    this.tweens.add({
      targets: [this.scoreText1],
      alpha: { from: 1, to: 0 },
      ease: "Linear",
      duration: 3000,
    });
  }

  /*
If a player fails, we will show a message to the player and then we reveal the current scoreboard.
  */
  showShame(playerName) {
    const rants = [
      "You're a disgrace",
      "Shame on you",
      "You dishonor us all",
      "You're a disappointment",
      "You're a failure",
      "You dishonor this dojo",
    ];
    this.scoreText1.setText(Phaser.Math.RND.pick(rants)).setAlpha(1);
    this.scoreText2.setText(`${playerName}`).setAlpha(1);
    this.tweens.add({
      targets: [this.scoreText1, this.scoreText2],
      alpha: { from: 1, to: 0 },
      ease: "Linear",
      duration: 3000,
      onComplete: () => {
        this.showResult();
      },
    });
  }

  /*
This shows the current number and the next operation.
  */
  showNextOperation(operator, nextNumber) {
    this.numberText.setText(this.number);
    this.operatorText.setText(`${operator}${nextNumber}`);
  }
}
