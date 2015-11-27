## Special Template Directories & Files

pg-generator templates contain several directories and files. Directories and files listed below are part of pg-generator templates. [nunjucks](https://mozilla.github.io/nunjucks/) templates located in those directories are executed once or more. They create files in same relative position as relative position to their parent directory.

**For example**:<br>
**Template directory**: .../sequelize<br>
**Target directory**: .../model<br>
**Database name**: crm<br>
**Database schemas**: public<br>
**Database tables**: company, contact, product<br>

| Template File | Created File |
|-|-|
| <span style="font-family: monospace">.../sequelize/db/{db.name}.js.nunj.html</span> | <span style="font-family: monospace">.../model/crm.js</span>
| <span style="font-family: monospace">.../sequelize/schema/{schema.name}.js.nunj.html</span> | <span style="font-family: monospace">.../model/public.js</span>
| <span style="font-family: monospace">.../sequelize/schema/sub/{schema.name}.js.nunj.html</span> | <span style="font-family: monospace">.../model/sub/public.js</span>
| <span style="font-family: monospace">.../sequelize/table/{table.name}.js.nunj.html</span> | <span style="font-family: monospace">.../model/company.js</span>
| <span style="font-family: monospace">.../sequelize/table/{table.schema.name}/{table.name}.js.nunj.html</span> | <span style="font-family: monospace">.../model/public/company.js</span>


### "db" directory

Template files in `db` are executed once for the database. Variables listed below are available in those template files. 

| Varible Name | Description | Example | Details
|-|-|-|
| db | pg-structure database object to access database details. | [DB API](http://www.pg-structure.com/api/DB)
| custom | Custom data provided by custom data file. | See below 
| options | Options provided by custom options file. | See below
| {...} | Any variable provided by index.js file's allData export. | See below
| {...} | Any variable provided by index.js file's dbData export. | See below

### "schema" directory

Template files in `schema` are executed for each PostgreSQL schema. Variables listed below are available in those template files. Files in this directory are created relative to the root of target directory.

| Varible Name | Description | Example | Details
|-|-|-|
| schema | pg-structure schema object to access database details. | [Schema API](http://www.pg-structure.com/api/Schema)
| custom | Custom data provided by custom data file. | See below 
| options | Options provided by custom options file. | See below
| {...} | Any variable provided by index.js file's allData export. | See below
| {...} | Any variable provided by index.js file's schemaData export. | See below

### "table" directory

Template files in `table` are executed for each table. Variables listed below are available in those template files. Files in this directory are created relative to the root of target directory.

| Varible Name | Description | Example | Details
|-|-|-|
| schema | pg-structure table object to access database details. | [Table API](http://www.pg-structure.com/api/Table)
| custom | Custom data provided by custom data file. | See below 
| options | Options provided by custom options file. | See below
| {...} | Any variable provided by index.js file's allData export. | See below
| {...} | Any variable provided by index.js file's tableData export. | See below

### "copy" directory

Files in this directory are not processed by template engine and directly copied to target. Files in this directory are copied relative to the root of target directory.

### "index.js" file

`index.js` file is a node.js module file which exports `allData`, `dbData`, `schemaData` and `tableData` functions. Those functions are used to provide additional variables to template files. It makes pg-generator templates very flexible. See [Template Module API](../API/Template Module API.md)

```js
'use strict';

// This file is used for providing additional data to templates during generation phase.

function allData(db) {
    return {
        extraAll: db.name
    };
}

function dbData(db) {
    return {
        extra: db.name
    };
}

function schemaData(schema) {
    return {
        extra: schema.name
    };
}

function tableData(table) {
    return {
        extra: table.name
    };
}

module.exports = {
    allData: allData,
    dbData: dbData,
    schemaData: schemaData,
    tableData: tableData
};
```

### Other Directories & Files

Other directories and files do not have any meaning for pg-generator and they are not used. However you can create any directory to organize your partial templates.

## External Files

External files are not part of the template. These optional files are set during file generation phase dynamically by options provided to `pgen` command.

    $ pgen sequelize --datafile custom-data.js --optionsFile customOptions
 
### Custom Data File

This optional file is a node.js module which should export a simple JavaScript object. Exported object can be accessed with variable named `custom` in template files. This data may be used very flexible ways for various reasons. For example builtin sequelize template uses this file for letting user to change some default behavior of template.
 
**Example**

```js
'use strict';

module.exports = {
    Account: {
        schema: 'super_schema',
        customTableAttribute: '"tableAtt"',
        attributes: {
            id: { type: '"fake_type_id"', onUpdate: '"UPDATE ME"', customAttribute: 3 },
            ss: { type: '"fake_type_ss"', specialAttribute: '"ok"' },
            dd: { type: '"fake_type_dd"', onUpdate: '"UPDATE ME TOO"', specA: 3, specB: 4, specC: 6 }
        },
        hasMany: {
            HasContacts: {
                as: 'CustomHasContacts'
            }
        },
        belongsTo: {
            Owner: {
                as: 'CustomBelongsTo'
            }
        },
        belongsToMany: {
            ContactSecondCompanies: {
                as: 'CustomBelongsToMany',
                foreignKey: 'fake_id'
            }
        }
    }
};
```

### Options File

This optional file is a node.js module which should export a simple JavaScript object. Exported object can be accessed with variable named `options` in template files. Usage of this file is same as custom data file except variable name used for accessing data.