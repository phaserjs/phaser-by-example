class Player {
  constructor(scene, name) {
    this.scene = scene;
    this.name = name;
    this.score = 0;
    this.lastMessage = null;
    this.dead = false;
    this.penalties = 0;
  }

  /*
We can use this function to check if the player has spammed the chat. We will use it to avoid players spamming the game with chat messages.
  */
  hasSpammed() {
    if (!this.lastMessage) return false;

    const current = new Date();
    const timeDifferenceInMilliseconds = current - this.lastMessage;
    return timeDifferenceInMilliseconds / 1000 < this.scene.spamTimeWait;
  }

  /*
We could optionally penalize the user for spamming or whatever we want to do. With this mechanism, we just ignore the messages for 10 seconds.
  */
  setPenalty() {
    this.penalties++;
    this.score = 0;
    this.dead = true;
    this.scene.time.delayedCall(
      10000 * this.penalties,
      () => {
        this.dead = false;
      },
      null,
      this
    );
  }
}

export default Player;
