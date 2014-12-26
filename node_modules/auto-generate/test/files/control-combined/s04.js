//!-AGS----------------------- Auto Start: PART 2 ------------------------------
// Do NOT edit text between auto start and auto end. It is auto generated.

// Load the net module to create a tcp server.
var net = require('net');

// Creates a new TCP server. The handler argument is automatically set as a listener for the 'connection' event
var server = net.createServer(function (socket) {

    // Every time someone connects, tell them hello and then close the connection.
    console.log("Connection from " + socket.remoteAddress);
    socket.end("Hello World\n");

});

// Fire up the server bound to port 7000 on localhost
server.listen(7000, "localhost");

// Put a friendly message on the terminal
console.log("TCP server listening on port 7000 at localhost.");

// 7e9ddbf8dfc7414bb176dd474bc1de6f You can edit safely after auto end.
//!-AGE------------------------ Auto End: PART 2 -------------------------------

//!-AGS----------------------- Auto Start: PART 1 ------------------------------
// Do NOT edit text between auto start and auto end. It is auto generated.

// This content is the source code to simulate auto generated content.

var manualEdited = 'This file is edited manually and should throw error.';

// e36fafa81bf45d1f4c916d71963a5999 You can edit safely after auto end.
//!-AGE------------------------ Auto End: PART 1 -------------------------------

var manualContent = 'This is manually added part';
for (var i = 0; i++; i <= 10) {
    console.log(i);
}