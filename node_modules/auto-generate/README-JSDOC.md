#Auto Generate

This module creates or updates parts of JS files with given content.

#Synopsis

If you are writing code generators, you can use this module to inject your auto created code into source code safely.

#Install

npm install auto-generate;

#Usage

Consdering that you want to include JS code like below:

```
var Project = sequelize.define('Project', {
    title: Sequelize.STRING,
    description: Sequelize.TEXT
});
```

You can include it using:

```
var autogen = require('auto-generate');
// content is your content to include in the generated/updated file.
autogen(path.join(__dirname, 'model', 'account.js'), 'Project Model', content);
```

This updates or if not exists creates 'model/account.js' file with your content. Your content would wrapped with block
start and block end markers for further updates. The block shown below:

```
//!-AGS----------------------- Auto Start: Project Model------------------------
// Do NOT edit text between auto start and auto end. It is auto generated.

var Project = sequelize.define('Project', {
    title: Sequelize.STRING,
    description: Sequelize.TEXT
});

// 253792a6b07b0bbaa72526687b374cba You can edit safely after auto end.
//!-AGE------------------------ Auto End: Project Model ------------------------
```

Other parts of the auto generated file may be edited by hand. Next time you want to update the part, this module
finds the part and checks if inside of the part is changed, then updates the part according to given options.

## JSDOC Output

I added both jsdox and jsdoc2md output below

