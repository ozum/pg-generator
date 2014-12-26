var assert  = require('chai').assert;
var rewire  = require('rewire');
var module  = rewire('../lib/auto-generate.js');
var fs      = require('fs');
var path    = require('path');
var rimraf  = require('rimraf');
var autogen = require('../lib/auto-generate.js')

var calculateMD5 = module.__get__('calculateMD5');


function createControlFiles() {
    fs.readdirSync(__dirname + '/files/source').forEach(function(file) {
        var file1Content = fs.readFileSync(__dirname + '/files/source/' + file).toString();
        try { fs.mkdirSync(__dirname +'/files/control'); } catch(err) {}
        try { fs.mkdirSync(__dirname +'/files/control-ignore-whitespace'); } catch(err) {}
        try { fs.mkdirSync(__dirname +'/files/control-ignore-whitespace-comment'); } catch(err) {}
        autogen(__dirname + '/files/control/' + path.basename(file), 'PART 1', file1Content, { ignoreWhitespaceChange: false, ignoreCommentChange: false } );
        autogen(__dirname + '/files/control-ignore-whitespace/' + path.basename(file), 'PART 1', file1Content, { ignoreWhitespaceChange: true, ignoreCommentChange: false } );
        autogen(__dirname + '/files/control-ignore-whitespace-comment/' + path.basename(file), 'PART 1', file1Content, { ignoreWhitespaceChange: true, ignoreCommentChange: true } );
    });
}

function isEqualFilesForOptions(file1, file2, options) {
    options = options || { ignoreWhitespaceChange: true, ignoreCommentChange: false };
    var file1Content = fs.readFileSync(path.join(__dirname, file1)).toString();
    var file2Content = fs.readFileSync(path.join(__dirname, file2)).toString();
    return calculateMD5(file1Content, options) == calculateMD5(file2Content, options);
}

function fileContent(file) {
    return fs.readFileSync(path.join(__dirname, file)).toString();
}


function getPart(file, name, options) {
    var originalGetPart = module.__get__('getPart');
    var content = fs.readFileSync(path.join(__dirname, 'files/', file)).toString();
    return originalGetPart(name, content, options);
}

function createTemp() {
    removeTemp();
    fs.mkdirSync(path.join(__dirname, 'temp'));
}

function removeTemp() {
    rimraf.sync(path.join(__dirname, 'temp'));
}

describe('calculateMD5 function', function() {
    it('should return same values for same file.', function() {
        var options = { ignoreWhitespaceChange: false, ignoreCommentChange: false };
        assert.isTrue( isEqualFilesForOptions('files/source/p1-original.js', 'files/source/p1-original.js', options) );
    });

    it('should return different values for different files.', function() {
        var options = { ignoreWhitespaceChange: false, ignoreCommentChange: false };
        assert.isFalse( isEqualFilesForOptions('files/source/p1-original.js', 'files/source/p1-altered.js', options) );
        assert.isFalse( isEqualFilesForOptions('files/source/p1-original.js', 'files/source/p1-altered-whitespace-only.js', options) );
        assert.isFalse( isEqualFilesForOptions('files/source/p1-original.js', 'files/source/p1-altered-whitespace-comment-only.js', options) );
    });

    it('should ignore whitespace change.', function() {
        var options = { ignoreWhitespaceChange: true, ignoreCommentChange: false };
        assert.isTrue( isEqualFilesForOptions('files/source/p1-original.js', 'files/source/p1-altered-whitespace-only.js', options) );
        assert.isFalse( isEqualFilesForOptions('files/source/p1-original.js', 'files/source/p1-altered-whitespace-comment-only.js', options) );
        var autoContent = fs.readFileSync(path.join(__dirname, 'files/source/p1-original.js')).toString();
        assert.equal('e36fafa81bf45d1f4c916d71963a5999', calculateMD5(autoContent, options));
    });

    it('should ignore whitespace and comment change.', function() {
        var options = { ignoreWhitespaceChange: true, ignoreCommentChange: true };
        assert.isTrue( isEqualFilesForOptions('files/source/p1-original.js', 'files/source/p1-altered-whitespace-only.js', options) );
        assert.isTrue( isEqualFilesForOptions('files/source/p1-original.js', 'files/source/p1-altered-whitespace-comment-only.js', options) );
        assert.isFalse( isEqualFilesForOptions('files/source/p1-original.js', 'files/source/p1-altered.js', options) );
    });

    it('should ignore comment and also automatically whitespace change.', function() {
        var options = { ignoreWhitespaceChange: false, ignoreCommentChange: true };
        assert.isTrue( isEqualFilesForOptions('files/source/p1-original.js', 'files/source/p1-altered-whitespace-only.js', options) );
        assert.isTrue( isEqualFilesForOptions('files/source/p1-original.js', 'files/source/p1-altered-whitespace-comment-only.js', options) );
        assert.isFalse( isEqualFilesForOptions('files/source/p1-original.js', 'files/source/p1-altered.js', options) );
    });

});

describe('fileExists function', function() {
    var fileExists = module.__get__('fileExists');

    it('should confirm that file exists', function() {
        assert.isTrue( fileExists(path.join(__dirname, 'files/source/p1-original.js')) );
    })

    it('should confirm that file does not exist', function() {
        assert.isFalse( fileExists(path.join(__dirname, 'no-file')) );
    })

    it('should throw exception if path is a directory', function() {
        assert.throw( function() { fileExists(path.join(__dirname, 'files')) }, /File exists but it's a driectory/);
    })

});


describe('getPart function', function() {
    it('should parse part', function() {
        var options = { ignoreWhitespaceChange: false, ignoreCommentChange: false };
        var part = getPart('control/p1-original.js', 'PART 1', options );
        assert.equal(part.startLine, '//!-AGS----------------------- Auto Start: PART 1 ------------------------------\n');
        assert.equal(part.warningLine, '// Do NOT edit text between auto start and auto end. It is auto generated.\n\n');
        assert.equal(part.md5Line, '\n\n// 253792a6b07b0bbaa72526687b374cba You can edit safely after auto end.\n');
        assert.equal(part.oldDigest, '253792a6b07b0bbaa72526687b374cba');
        assert.equal(part.newDigest, '253792a6b07b0bbaa72526687b374cba');
        assert.isFalse(part.isChanged);
        assert.equal(part.endLine, '//!-AGE------------------------ Auto End: PART 1 -------------------------------\n\n');
    });

    it('should detect change', function() {
        var options = { ignoreWhitespaceChange: false, ignoreCommentChange: false };
        var part = getPart('control-manual/p1-manual-modified.js', 'PART 1', options );
        assert.equal(part.startLine, '//!-AGS----------------------- Auto Start: PART 1 ------------------------------\n');
        assert.equal(part.warningLine, '// Do NOT edit text between auto start and auto end. It is auto generated.\n\n');
        assert.equal(part.md5Line, '\n\n// 253792a6b07b0bbaa72526687b374cba You can edit safely after auto end.\n');
        assert.equal(part.oldDigest, '253792a6b07b0bbaa72526687b374cba');
        assert.isTrue(part.isChanged);
        assert.equal(part.endLine, '//!-AGE------------------------ Auto End: PART 1 -------------------------------\n\n');
    });
});

describe('createPart function', function() {
    var createPart = module.__get__('createPart');
    it('should create content', function() {
        var options = { ignoreWhitespaceChange: false, ignoreCommentChange: false };
        var autoContent = fs.readFileSync(path.join(__dirname, 'files/source/p1-original.js')).toString();
        var part        = getPart('control/p1-original.js', 'PART 1', options );
        assert.equal(part.all, createPart('PART 1', autoContent, options) );
    });

    it('should create content whitespace ignored', function() {
        var options = { ignoreWhitespaceChange: true, ignoreCommentChange: false };
        var autoContent = fs.readFileSync(path.join(__dirname, 'files/source/p1-original.js')).toString();
        var part        = getPart('control/p1-original.js', 'PART 1', options );
        var partWS      = getPart('control-ignore-whitespace/p1-original.js', 'PART 1', options );
        assert.notEqual(part.all, createPart('PART 1', autoContent, options) );
        assert.equal(partWS.all, createPart('PART 1', autoContent, options) );
    });

    it('should create content whitespace and comments ignored', function() {
        var options = { ignoreWhitespaceChange: true, ignoreCommentChange: true };
        var autoContent = fs.readFileSync(path.join(__dirname, 'files/source/p1-original.js')).toString();
        var part        = getPart('control/p1-original.js', 'PART 1', options );
        var partWS      = getPart('control-ignore-whitespace-comment/p1-original.js', 'PART 1', options );
        assert.notEqual(part.all, createPart('PART 1', autoContent, options) );
        assert.equal(partWS.all, createPart('PART 1', autoContent, options) );
    });
})

describe('makeBackup function', function() {
    var makeBackup = module.__get__('makeBackup');
    var filePath   = path.join(__dirname, 'temp', 'test-file.js');

    before(function() { createTemp(); fs.writeFileSync(filePath); });
    after(function() { removeTemp(); }) // Delete temp directory with its content

    it('should move the file to backup location', function(done) {
        assert.isTrue(fs.statSync(filePath).isFile());
        makeBackup(filePath);
        var fileName = fs.readdirSync(path.join(__dirname, 'temp', 'BACKUP' ))[0]
        assert.isTrue(fs.statSync(path.join(__dirname, 'temp', 'BACKUP', fileName)).isFile());
        done();
    })
});


describe('module', function() {
    beforeEach(function() { createTemp(); });
    afterEach(function() { rimraf.sync(path.join(__dirname, 'temp')) }) // Delete temp directory with its content

    var sourceP1 = fs.readFileSync(path.join(__dirname, 'files/source/p1-original.js')).toString();
    var sourceP2 = fs.readFileSync(path.join(__dirname, 'files/source/p2-original.js')).toString();
    var options = { ignoreWhitespaceChange: false, ignoreCommentChange: false };

    it('should create files with default options', function() {
        autogen(path.join(__dirname, 'temp', 'p1-original.js'), 'PART 1', sourceP1);
        assert.equal(fileContent('temp/p1-original.js'), fileContent('files/control-ignore-whitespace/p1-original.js'));
    });

    it('should create files with options', function() {
        autogen(path.join(__dirname, 'temp', 'p1-original.js'), 'PART 1', sourceP1, options);
        assert.equal(fileContent('temp/p1-original.js'), fileContent('files/control/p1-original.js'));
    });


    it('should update files', function() {
        fs.writeFileSync(path.join(__dirname, 'temp/scenario.js'), fileContent('files/control-combined/s01.js'));
        autogen(path.join(__dirname, 'temp', 'scenario.js'), 'PART 1', sourceP1);
        assert.equal(fileContent('temp/scenario.js'), fileContent('files/control-combined/s02.js'));
        autogen(path.join(__dirname, 'temp', 'scenario.js'), 'PART 2', sourceP2);
        assert.equal(fileContent('temp/scenario.js'), fileContent('files/control-combined/s03.js'));
    })

    it('should throw error for manually edited file', function() {
        fs.writeFileSync(path.join(__dirname, 'temp/scenario.js'), fileContent('files/control-combined/s04.js'));
        assert.throw( function() { autogen(path.join(__dirname, 'temp', 'scenario.js'), 'PART 1', sourceP1); }, /File is changed by hand/);
    })

    it('should overwrite even manually edited file', function() {
        var options = { overWriteEvenChanged: true };
        fs.writeFileSync(path.join(__dirname, 'temp/scenario.js'), fileContent('files/control-combined/s04.js'));
        autogen(path.join(__dirname, 'temp', 'scenario.js'), 'PART 1', sourceP1, options);
        assert.equal(fileContent('temp/scenario.js'), fileContent('files/control-combined/s03.js'));
    })



});

