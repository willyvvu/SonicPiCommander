var osc = require("osc"),
    http = require("http"),
    WebSocket = require("ws"),
    express = require("express");

// Create an Express server app
// and serve up a directory of static files.
var app = express(),
    server = app.listen(8000);

app.use("/", express.static(__dirname + "/client"));

console.log("Starting up...");

// Listen for Web Socket requests.
var wss = new WebSocket.Server({
    server: server
});

var udpPort;

// Listen for Web Socket connections.
wss.on("connection", function (socket) {
    var socketPort = new osc.WebSocketPort({
        socket: socket
    });

    socketPort.on("message", function (oscMsg) {
        // Send an OSC message to, say, SuperCollider
        // udpPort.send(oscMsg, "localhost", 4557);
        udpPort.send(oscMsg);
        console.log("Forwarding: ", oscMsg);
    });
});

// Create an osc.js UDP Port
udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 4555,
    remoteAddress: "localhost",
    remotePort: 4557
});
// Listen for incoming OSC bundles.
// udpPort.on("bundle", function (oscBundle, timeTag, info) {
//     console.log("An OSC bundle just arrived for time tag", timeTag, ":", oscBundle);
//     console.log("Remote info is: ", info);
// });

// Open the socket.
udpPort.open();