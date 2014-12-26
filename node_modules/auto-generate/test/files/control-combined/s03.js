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
function fileExists(file) {
    try {
        var targetStat = fs.statSync(file);
        if (targetStat.isDirectory() ) {
            throw new Error("File exists but it's a driectory: " + file);
        }
    }
    catch(err) {
        if (err.code == 'ENOENT') {         // No such file or directory
            return false;
        }
        else {
            throw err;
        }
    }
    return true;
}


// Below comment is to test parser.
// 13a75ba032194d216f3f9eba3532fe7f You can edit safely after auto end.

var reAuto = _.template('(<%= startLine %>)(<%= warningLine %>)((?:.|\n|\r)*?)(<%= md5Line %>)(<%= endLine %>)');
var reString    = reAuto({ startLine: autoStartLine(name), warningLine: template.warning(), md5Line: template.md5({ md5: '([a-fA-F0-9]{32})' }), endLine: autoEndLine(name) });
var re          = new RegExp(reString, 'm');
var parts       = re.match(fileContent);

// This is a comment line

var fe = fileExists('calculate.js');

// e36fafa81bf45d1f4c916d71963a5999 You can edit safely after auto end.
//!-AGE------------------------ Auto End: PART 1 -------------------------------

var manualContent = 'This is manually added part';
for (var i = 0; i++; i <= 10) {
    console.log(i);
}