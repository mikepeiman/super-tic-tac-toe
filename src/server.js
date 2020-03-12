import sirv from "sirv";
const http = require("http");
import polka from "polka";
import compression from "compression";
import * as sapper from "@sapper/server";
import roomServer from './RoomServer'

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";
const server = http.createServer();
const app = polka({ server });
// You can also use Express
app
  .use(
    compression({ threshold: 0 }),
    sirv("static", { dev }),
    sapper.middleware()
  )
  .listen(PORT, err => {
    if (err) console.log("error", err);
  });

// var http = require("http").createServer(app);
const io = require("socket.io")(server);

let sequenceNumberByClient = new Map();
let clientInstance = 1;
// event fired every time a new client connects:
io.on("connection", socket => {
  function refreshLobbyRooms() {
    io.in("lobby").emit("refresh lobby rooms", roomServer.getLobbyRooms());
  }

  function refreshLobbyMessages() {
    socket.broadcast
      .to("lobby")
      .emit("refresh lobby messages", roomServer.getLobbyMessages());
  }

  function getRoomPlayers() {
    io.in(socket.currentRoom).emit(
      "refresh room players",
      roomServer.getPlayers(socket.currentRoom)
    );
  }

  socket.on("add user name", function addUser(username) {
    // user chooses a username
    console.log(
      `server.js: add user name ${username} and about to emit 'get user id' for ${socket.id}`
    );
    socket.emit("get user id", username + "___" + socket.id); // return socket id to client
    socket.join("lobby"); // join the main chat channel
    socket.emit("refresh lobby rooms", roomServer.getLobbyRooms()); // get the state of the lobby, not refreshing for everyone though
    socket.emit("refresh lobby messages", roomServer.getLobbyMessages());
    socket.username = username; // set the socket instance (per user) to their chosen username
  });

  socket.on("add user emoji", function addUser(username) {
    // user chooses a username
    console.log(`server.js: add user emoji ${username}`);
  });
  console.info(`From server.js: Client connected [id=${socket.id}]`);
  // initialize this client's sequence number
  // sequenceNumberByClient.set(socket, clientInstance);
  // clientInstance++;
  // when socket disconnects, remove it from the list:
  socket.on("disconnect", () => {
    sequenceNumberByClient.delete(socket);
    console.info(`Client gone [id=${socket.id}] name=${socket.username}`);
  });
  // setInterval(() => {
  // for (const [client, clientInstance] of sequenceNumberByClient.entries()) {
  //   client.emit("seq-num", `clientInstance: ${clientInstance}___${socket.id}`);
  //   client.emit("test1", `socket.username: ${socket.username}`);
  //   sequenceNumberByClient.set(client, clientInstance);
  //   console.info(`From server.js: ${clientInstance}___${socket.id}: `);
  // }
  // }, 1000);

  socket.on("create room", function createRoom(name, locked, PIN) {
    // room object with name, locked status and PIN
    const id = roomServer.createRoom(
      name,
      socket.id,
      socket.username,
      locked,
      PIN
    ); // pass params to method and get back the id returned by method
    socket.join(id); // join socket.io room by id
    socket.leave("lobby"); // leave the lobby for memory purposes
    socket.currentRoom = id; // track current room server side
    refreshLobbyRooms(); // notify clients a new room was created
  });

  socket.on("create room", function createRoom(name, locked, PIN) {
    // room object with name, locked status and PIN
    const id = roomServer.createRoom(
      name,
      socket.id,
      socket.username,
      locked,
      PIN
    ); // pass params to method and get back the id returned by method
    socket.join(id); // join socket.io room by id
    socket.leave("lobby"); // leave the lobby for memory purposes
    socket.currentRoom = id; // track current room server side
    refreshLobbyRooms(); // notify clients a new room was created
  });

  socket.on("join room", function joinRoom(id) {
    // the room id is being passed in from client
    const full = roomServer.joinRoom(id, socket.id, socket.username); // pass room id and current user to the join function, get back true if room is full
    socket.join(id); // join socket.io room by id
    socket.leave("lobby"); // leave the lobby for memory purposes
    socket.currentRoom = id; // track current room server side
    getRoomPlayers();
    if (full) {
      io.in(socket.currentRoom).emit("ready check");
    }
  });

  socket.on("ready", function ready() {
    // each player emits a ready from client side
    const king = roomServer.playerReady(socket.currentRoom, socket.id); // send room id and player id to method, returned back is the user id of the king
    if (king) {
      roomServer.removeRoomFromLobby(socket.currentRoom);
      refreshLobbyRooms();
      io.in(socket.currentRoom).emit("choose question", king);
    }
  });
});

// sends each client its current sequence number
