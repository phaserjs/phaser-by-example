import tmi from "tmi.js";

export default class Chat {
  constructor(scene, username, password, channels) {
    this.scene = scene;
    this._username = username;
    this._password = password;

    const urlParams = new URLSearchParams(window.location.search);
    this.channel = urlParams.get("channel") || "devdiaries";
    this.feedback = urlParams.get("feedback") == "1";
    this.maxPlayers = this.isValidNumberWithMax(urlParams.get("maxplayers"))
      ? +urlParams.get("maxplayers")
      : 500;

    this.init();
  }

  /*
    This is where we create the connection to the chat. We just specify the channel, but we could add and identity to log in with a user and send messages to the channel or do actions during the game. With just the channel connection, we will be able to read the chat and act accordingly, which could be enough for some games.
  */
  init() {
    console.log(
      "Chat channel: ",
      this.channel,
      "feedback: ",
      this.feedback,
      "maxPlayers: ",
      this.maxPlayers
    );
    this.client = new tmi.Client({
      options: { debug: false },
      // identity: {
      //     username: "devdiaries", // We could actualy log in with a user
      //     password: NOPE   // and send messages or do actions
      // },
      channels: [this.channel],
    });

    this.client
      .connect()
      .then((ok) => {
        console.log("Connected!, loading game");
        this.scene.loadGame();
      })
      .catch(console.error);

    this.setOnJoinListener();
    this.setOnMessageListener();
    this.setOnChatListener;
  }

  /*
    We add a listener to the join event, so we can add the player to the game when they join the chat.
  */
  setOnJoinListener() {
    this.client.on("join", (channel, username, self) => {
      console.log("Somebody joined the chat: ", channel, username);
      if (self) {
        this.scene.addPlayer(username);
      }
    });
  }

  /*
Messages to the chat can come with two different events: message or chat. We will process them both in the same way, but we need different event callbacks because the data comes in different formats.
  */
  setOnMessageListener() {
    this.client.on("message", (channel, tags, message, self) => {
      console.log(`Message: ${tags.username} just ${message}`);
      this.processMessage(tags.username, message);
    });
  }

  setOnChatListener() {
    this.client.on("chat", async (channel, user, message, self) => {
      if (user.mod) {
        // User is a mod.
      }
      const messageParts = message.toLowerCase().split(" ");
      console.log("Received chat: ", channel, user, messageParts);

      this.processMessage(user["display-name"], message);
    });
  }

  /*
Once we isolate the username and the message, we can process the message. In this case, we will check if the message is a number and if it is, we will send it to the game to check if it is the correct answer.
  */
  processMessage(username, message) {
    if (this.isValidNumber(message)) {
      this.scene.guess(username, +message);
    }
  }

  /*
We are not using this function but I leave it here: in case you want to send actions to the chat, like /me does.
  */
  sendAction(channel, msg) {
    console.log("Sending action: ", this.feedback, channel, msg);
    if (!this.feedback) return;
    this.client.action(channel, msg);
  }

  /*
We are not using this function either, but this is how you do it in case you want to send messages to the chat.
  */
  say(msg) {
    if (!this.feedback) return;
    this.client.say(this.channel, msg);
  }

  /*
We use these two functions to validate the number sent by the user. It must be a number within a limit.
  */
  isValidNumberWithMax(number, limit = 100) {
    return this.isValidNumber(number) && +number > 0 && +number <= limit;
  }

  isValidNumber(number) {
    return !isNaN(number);
  }
}
