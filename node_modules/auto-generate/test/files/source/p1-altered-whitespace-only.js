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

var reAuto          = _.template('(<%= startLine %>)(<%= warningLine %>)((?:.|\n|\r)*?)(<%= md5Line %>)(<%= endLine %>)');
var reString        = reAuto({ startLine: autoStartLine(name), warningLine: template.warning(), md5Line: template.md5({ md5: '([a-fA-F0-9]{32})' }), endLine: autoEndLine(name) });
var re              = new RegExp(reString, 'm');
var parts           = re.match(fileContent);

// This is a comment line

var fe = fileExists('calculate.js');