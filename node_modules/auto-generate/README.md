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

#Index

**Modules**

* [auto-generate](#module_auto-generate)
  * [module.exports(filePath, name, content, options) ⏏](#exp_module_auto-generate)
    * [auto-generate~autoStartLine(name)](#module_auto-generate..autoStartLine)
    * [auto-generate~autoEndLine(name)](#module_auto-generate..autoEndLine)
    * [auto-generate~makeBackup(filePath)](#module_auto-generate..makeBackup)
    * [auto-generate~createPart(name, content, options)](#module_auto-generate..createPart)
    * [auto-generate~getRegularExpression(name)](#module_auto-generate..getRegularExpression)
    * [auto-generate~getPart(name, fileContent, options)](#module_auto-generate..getPart)
    * [auto-generate~fileExists(file)](#module_auto-generate..fileExists)
    * [auto-generate~calculateMD5(text, options)](#module_auto-generate..calculateMD5)

**Typedefs**

* [type: genOptions](#genOptions)
* [type: partInfo](#partInfo)
 
<a name="module_auto-generate"></a>
#auto-generate
**Author**: Özüm Eldoğan  
<a name="exp_module_auto-generate"></a>
##module.exports(filePath, name, content, options) ⏏
Writes given content as an auto generated part to file considering options.

**Params**

- filePath `string` - File which content is written into  
- name `string` - Name of the part. This is used for differentiating it from other auto generated content.  
- content `string` - Content to write  
- options <code>[genOptions](#genOptions)</code> - Options how part is generated.  

**Example**  
var autogen = require('auto-generate');
var content = 'var someCode = "Joe";' // etc. auto generated code
autogen(path.join(__dirname, 'model', 'account.js'), 'model', content);

<a name="genOptions"></a>
#type: genOptions
Options used to create auto generated part.

**Properties**

- overWrite `boolean` - If file already exists. Update the file.  
- overWriteEvenChanged `boolean` - Overwrite generated part even it is modified manually.  
- backup `boolean` - Create backup if a file is overwritten.  
- ignoreWhitespaceChange `boolean` - Assume it is unmodified if whitespace is modified when calculating digest.  
- ignoreCommentChange `boolean` - Assume it is unmodified if comment is changed when calculating digest. This also enables ignoreWhitespaceChange too.  
- atStart `boolean` - Add text at the end of file. Otherwise it adds at the end. Either way replaces original text in place.  

**Type**: `Object`  
<a name="partInfo"></a>
#type: partInfo
Object which contains detailed info of an auto generated part.

**Properties**

- startLine `string` - Start line (opening tag / marker) of auto generated part.  
- warningLine `string` - Warning message line of auto generated part.  
- content `string` - Auto generated content.  
- md5Line `string` - Line which contains md5 of the content.  
- oldDigest `string` - MD5 which is written in the file.  
- newDigest `string` - MD5 calculated freshly for the content.  
- isChanged `boolean` - Indicates if part is modified by comparing MD5 written in file with new calculated MD5  
- endLine `string` - End line (closing tag / marker) of auto generated part.  

**Type**: `Object`  
# auto-generate





* * *

### auto-generate.module:auto-generate(filePath, name, content, options) 

Writes given content as an auto generated part to file considering options.

**Parameters**

**filePath**: `string`, File which content is written into

**name**: `string`, Name of the part. This is used for differentiating it from other auto generated content.

**content**: `string`, Content to write

**options**: `genOptions`, Options how part is generated.


**Example**:
```js
var autogen = require('auto-generate');
var content = 'var someCode = "Joe";' // etc. auto generated code
autogen(path.join(__dirname, 'model', 'account.js'), 'model', content);
```


### auto-generate.autoStartLine(name) 

Generates and returns start line (opening tag / marker) of auto generated part.

**Parameters**

**name**: `string`, name of the auto generated part

**Returns**: `string`, - first line of the auto generated part.


### auto-generate.autoEndLine(name) 

Generates and returns end line (closing tag / marker) of auto generated part.

**Parameters**

**name**: `string`, name of the auto generated part.

**Returns**: `string`, - last line of the auto generated part.


### auto-generate.makeBackup(filePath) 

Creates backup of a file. To do this, it creates a directory called BACKUP in the same directory where
original file is located in. Backup file name has a suffix of ISO style date and time.
ie. 'model.js' becomes '2014-01-12 22.02.23.345 model.js'

**Parameters**

**filePath**: `string`, Absolute path of file



### auto-generate.createPart(name, content, options) 

Generates and returns auto generated content wrapped by start line, end line, digest (such as md5)
and other details.

**Parameters**

**name**: `string`, Name of the auto generated part

**content**: `string`, Auto generated content

**options**: `genOptions`, Options how part is generated.

**Returns**: `string`, - Generated part


### auto-generate.getRegularExpression(name) 

Returns regular expression object to find and/or replace auto generated part.

**Parameters**

**name**: `string`, name of the auto generated part

**Returns**: `RegExp`, - Regular expression object


### auto-generate.getPart(name, fileContent, options) 

Finds auto generated part and returns an object which contains information about auto generated part.
If auto part with requested name cannot be found, it returns null.

**Parameters**

**name**: , Name of the auto generated part.

**fileContent**: , content of the file which part is searched in.

**options**: `genOptions`, Options how part is generated.

**Returns**: `partInfo | null`, - Object which contains info about auto generated part.


### auto-generate.fileExists(file) 

Checks if the file exists at the given path. Returns true if it exists, false otherwise.

**Parameters**

**file**: `string`, Path of the file to check

**Returns**: `boolean`


### auto-generate.calculateMD5(text, options) 

Claculates MD5 of the given text according to options. If ignoreWhitespaceChange and/or ignoreCommentChange options
are true, MD5 is calculated after UglifyJS minified the source code according to given options.

**Parameters**

**text**: `string`, Text to calculate MD5 from

**options**: `genOptions`, Options how MD5 is calculated

**Returns**: `string`, - MD5 of the text



* * *










