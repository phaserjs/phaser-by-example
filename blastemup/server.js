const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

/*
We set up a very basic express server. By default, we will serve the index.html page built by our Webpack build on the front end. Anything below dist will be served automatically, so the game JavaScript and assets will be served statically as well.
*/
app.get("/", function (request, response) {
  response.sendFile(__dirname + "/dist/index.html");
});

app.use("/", express.static("dist"));

http.listen(5001, function () {
  console.log("Server ready, listening on port ", 5001);
});

const players = {};

/*
This is where we set all the events that our server will listen to. It will react like this:

- Is a new user connected? Notify it to the rest of the players to generate it as a new Enemy.

- Is a player disconnected? Notify the rest of the players to destroy this enemy.

Has the player moved? Notify it to the rest of the players so they can update the position of the enemy.

For debugging purposes, we left some logs on these events.
*/
io.on("connection", function (socket) {
  socket.on("newPlayer", function (newPlayer) {
    console.log("New player joined with state:", newPlayer);
    const [name, key] = newPlayer.name.split(":");
    players[key] = newPlayer;

    socket.emit("currentPlayers", players);
    socket.broadcast.emit("newPlayer", newPlayer);
  });

  socket.on("playerDisconnected", function (key) {
    delete players[key];
    console.log("Serve > player destroyed: ", key);

    socket.broadcast.emit("playerDisconnected", key);
  });

  socket.on("playerIsMoving", function (position_data) {
    console.log("Server> playerMoved> Player moved to ", position_data);
    const key = position_data?.key;
    if (players[key] == undefined) return;
    players[key].x = position_data.x;
    players[key].y = position_data.y;
    players[key].rotation = position_data.rotation;

    socket.broadcast.emit("playerMoved", players[key]);
  });
});
