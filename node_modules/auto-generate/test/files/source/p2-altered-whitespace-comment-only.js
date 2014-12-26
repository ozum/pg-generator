// Load the net module to create a tcp server.
var net = require('net');

// New comment. This comment is altered from original.
var server = net.createServer(function (socket) {

    // Every time someone connects, tell them hello and then close the connection.
    console.log("Connection from " + socket.remoteAddress);
    socket.end("Hello World\n");
});


server.listen(7000, "localhost");


// Put a friendly message on the terminal
console.log("TCP server listening on port 7000 at localhost.");