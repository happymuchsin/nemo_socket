import express from "express";
import pkg from "body-parser";
const { json } = pkg;
import { createServer } from "http";
import { Server } from "socket.io";
const app = express();
app.use(json());
const server = createServer(app);

import nemo from "./apps/nemo.js";

const io = new Server(server, {
  cors: {
    origin: [
      "http://192.168.150.72:7000",
      "http://192.168.150.72:5000",
      "http://192.168.150.72",
      "http://0.0.0.0:8000",
      "http://192.168.155.108",
      "http://web.urecel.com",
      "http://localhost",
    ],
    // origin: "*",
  },
});

const conId = {};
const conDivision = {};
const conPosition = {};
const conType = {};
const conApp = {};

app.post("/emit", (req, res) => {
  const { event, data } = req.body;
  if (event == "nemo") {
    nemo(io, data, conId, conDivision, conPosition, conType, conApp, event);
  }
  res.send({ status: "Event emitted" });
});

io.on("connection", (socket) => {
  // console.log("a user connected: " + socket.id);

  socket.on("register", ({ username, division, position, type, app }) => {
    conId[username] = socket.id;
    conDivision[division] = division;
    conPosition[position] = position;
    conType[type] = type;
    conApp[app] = app;
    var rooms = [
      app,
      app + " " + type,
      app + " " + type + " " + division,
      app + " " + type + " " + division + " " + position,
    ];
    socket.join(rooms);
    // console.log(
    //   `Device registered: ${username} ${nama} ${division} with socket ID: ${socket.id}`
    // );
  });

  socket.on("disconnect", () => {
    // Remove socket from conId mapping on disconnect
    for (const [
      username,
      division,
      position,
      type,
      app,
      socketId,
    ] of Object.entries(conId)) {
      if (socketId === socket.id) {
        delete conId[username];
        delete conDivision[division];
        delete conPosition[position];
        delete conType[type];
        delete conApp[app];
        var rooms = [
          app,
          app + " " + type,
          app + " " + type + " " + division,
          app + " " + type + " " + division + " " + position,
        ];
        socket.leave(rooms);
        break;
      }
    }
    // console.log("user disconnected: " + socket.id + new Date());
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
