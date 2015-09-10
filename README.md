
Other Languages
---------------
Türkçe: [Turkish Documentation is here](https://github.com/ozum/sequelize-pg-generator/blob/master/README-TR.md)

Description
-----------
This module is for auto generating Sequelize model from PostgreSQL databases. It reverse engineers your database and generates separate model files for each table. Default configuration parameters are carefully selected and they are sane to use. However it is possible to change most of the behaviours via configuration. This document is based on default configuration. Configuration parameters and default values are written as (Config parameter:value) where appropriate.

Special Thanks
--------------
This module is developed with the sponsorship of Fortibase.

Usage
-----

### Step 1: Install globally via npm -g

This will install module and CLI command

    $ npm install -g sequelize-pg-generator

### Step 2: Generate model files

Open terminal, go to your app.js root and create your models automatically into 'model' directory.

    $ cd path/to/my/node-app.js
    $ spgen -d my_database -u my_user -p my_password

### Step 3: Use it in your node.js app

Use Sequelize models provided by auto generated files in your application. See examples below.

    var orm = require('./model');
    orm.setup('my_database', 'my_user', 'my_password', {
        host: '127.0.0.1',
        logging: false,
        native: false
    });
    var sequelize = orm.sequelize;
    var contact = orm.model('public.contact'); // Can be configured without schema.

Windows Users
-------------
Some tips to install on windows. This module uses pg. If you like to use pg-native, below are some tips for windows users for a successful install:

* Python 2 should be installed. As of this writing it is not compatible with Python 3.
* You should add Python to the path and set PYTHONPATH via environment variables.
* PostgreSQL pg_config and libpq.dll must be on path. Usually adding bin and lib folders is ok. (For eaxmple: C:\Program Files\PostgreSQL\9.3\bin C:\Program Files\PostgreSQL\9.3\lib)
* Visual Studio Build Tools (C:\Program Files (x86)\MSBuild) should be installed. Installed automatically after VS 2012. If during install npm asks for different version of Visual Studio you can set it from command line during installation:
    > npm install -g sequelize-pg-generator --msvs_version=2013

CLI Options
-----------
    spgen [options]
    -h, --host [host]           IP address or host name of the database server
        --port [port]           Port of database server to connect
    -d, --database [database]   Database name
    -u, --user [user]           Username to connect to database
    -p, --password [password]   Password to connect to database
    -s, --schema [schema]       Comma separated names of the database schemas
    -o, --output [output]       Output folder
    -c, --config [config]       Path of the configuration file
    -t, --templateName          Use builtin template folder with given name
        --nolog                 No log output
        --resetConfig           Reset configuration. (Side-step. Not for production.)
        --throwError            Instead of logging errors to console, throws error.

* Fully documented. (JSDoc HTML files are under doc directory),
* Tested,
* No Dependencies on Generated Files,
* Multi schema support,
* One to many relation support (hasMany and belongsTo),
* Many to many relation support (hasMany through and belongsToMany),
* Inter-schema relation support. (i.e. public.account table to other_schema.cutomer table),
* Highly configurable,
* Fully customizable,
* CLI support,
* Smart naming of models and relations,
* Very easy to override auto generated files,
* Exclude tables,
* Debug,
* Table Specific Configuration,
* Validates and prevents naming clash.

WARNING: belongsToMany
----------------------
For many to many relations Sequelize version 2.0 RC3 and older does not support belongsToMany relation. After this version hasMany through relations are deprecated. Behaviour on this subject can be adjusted via configuration. (Config: generate.hasManyThrough:false and generate.belongsToMany:true)

Features
--------

### No Dependencies On Generated Files
Generated files have no dependencies besides core modules and Sequelize.

### Multi Schema Support
Supports multi PostgreSQL schemas. It is possible to have other schemas than public. User can select which schemas to reverse engineer via CLI or config. If more than one schema is included, models may be prefixed with schema names (Config: generate.useSchemaName: true, database.schema: ["public"]) to prevent tables with same name in different schemas try to have same model name.

    contact = orm.model('public.contact'); // Returns sequelize model for contact table.
    
### No Schema Prefix
User can configure not to prefix model names with schema
    
    // In config
    {...
        generate{
            useSchemaName: false
        }
    }
    
    contact = orm.model('contact'); // Returns sequelize model for contact table.
    
### One To Many Relation Support
This module automatically detects one to many relations and generates model.hasMany and model.belongsTo sequelize relations.

### Many To Many Relation Support
If two tables are joined via a join table this module detects it automatically and generates many to many sequelize relations. If a table has more than one foreign key, then it is considered many to many relation join table.

                      hasMany              hasMany
    TABLE:   product --------< line_item >--------- cart
    COLUMNS: id                cart_id (FK)         id
             name              product_id (FK)      customer_id (FK)
             color             quantity

This module generates belongsToMany relation and hasMany relation with through option. As of this writing master branch of Sequelize deprecated hasMany through relations. According to version of Sequelize you use, it should be adjusted via config of this module.

### Inter-Schema Relation Support
Detects relations between tables in different schemas. For example relations between public.account table and other_schema.customer table.

### Highly configurable
This module uses [config](https://www.npmjs.com/package/config) module. It is also possible to point a custom configuration file via CLI. See configuration parameters below in this document.

### Fully Customizable
This module uses [consolidate](https://www.npmjs.com/package/consolidate) compatible templates to generate model files. It uses [Swig](https://www.npmjs.com/package/swig) by default. User can use his/her custom templates without altering original one by pointing (Config: template.folder and template.engine:'swig') config values. Looking default templates in template folder of this module is highly recommended.

There should at least be three files in custom template folder:
    index.ext  Default template file. ext is whatever extension is used for your template engine.
    index.js   This file is copied with generated files. It's purpose is use generated files
    utils.js   This file is copied with generated files. Contains helper functions.

### CLI Support
If this module is installed as suggested globally with npm -g then spgen command would be available system wide to generate model files.

### Smart Naming of Models and Relations
sequelize-pg-generator uses table names or schema.table names for model naming. For relations it uses foreign key names and relation names from your database. (You are naming your relations in database meaningfully right?) Both camel case (tableName) or untouched names (table_name) methods can be used via configuration. Naming conventions are based on Sequelize module suggestions and generated explicitly with 'as' parameter.

                      product_cart_line_items              cart_cart_line_items
    TABLE:   product -------------------------< line_item >--------------------- cart
    COLUMNS: id                                 cart_id (FK)                     id
             name                               product (FK)                     customer_id (FK)
             color                              quantity

    NOTE: Beware line_item.cart_id has id suffix but line_item.product hasn't. This inconsistency is made purposefully for the sake of this example.

    Type of object          Naming Rule
    --------------          -----------
    Model                   tableName or schema.tableName
    hasMany                 Plural of the relation name in database. Table name from beginning can be stripped.
                            (Config: generate.stripFirstTableFromHasMany:true)
    belongsTo               Singular of foreign key. If key name ends with _id it will be stripped. Otherwise
                            'related' is added at the beginning to prevent it gets clash with column name.
                            (Config: generate.prefixForBelongsTo:'related')
    belongsToMany           Plural of the join table name + foreign key which refers other table in join table.
    hasMany({through:..})   Plural of the join table name + foreign key which refers other table in join table. (DEPRECATED in Sequelize)

    For the example structure:

    Relation                as                                  Details
    --------                --                                  -------
    product.hasMany         as:'cartLineItems'                  (Plural) Table name 'product' is stripped from the beginning
                                                                of relation name 'product_cart_line_items'
    product.belongsToMany   as:'cartLineItemCarts'              (Plural) _id suffix is stripped from, relation name (table name striiped)
                                                                added to foreign key name 'cart_id'
    product.hasMany Through as:'cartLineItemCarts'              (Plural) _id suffix is stripped from, relation name (table name striiped)
                                                                added to foreign key name 'cart_id'
    cart.hasMany            as:'cartLineItems'                  (Plural) Table name 'cart' is stripped from the beginning of
                                                                relation name 'cart_cart_line_items'
    cart.belongsToMany      as:'relatedCartLineItemProducts'    (Plural) No _id suffix. 'related' and relation name (table name striiped)
                                                                are added as prefix.
    cart.hasMany Through    as:'relatedcartLineItemProducts'    (Plural) No _id suffix. 'related' and relation name (table name striiped)
                                                                are added as prefix.
    lineItem.belongsTo      as:'relatedProduct'                 (Singular) No _id suffix. 'related' is added as prefix.
    lineItem.belongsTo      as:'cart'                           (Singular) _id suffix is stripped from foreign key name
                                                                'cart_id'.

Of course as all attributes, you can modify generated files in a non-destructive way as explained below.

### Very Easy to Override Auto Generated Files
By default auto generated files are located path/to/model/definition-files directory. Also there is 'definition-files-custom' directory. Users can create files with same names as auto generated files to override its attributes. There is also utils module generated to make modifications easier.

Those modifications are non destructive, because they override generated file in another file by inheriting it and default index.js file uses inherited files if it exists. Please bear in mind, those modifications occur before sequelize instances are generated.

For example for cart table 'definition-files/cart.js' is generated. User can create 'definition-files-custom/cart.js' and override necessary parts like example below. For all attributes you can look inside auto generated files.

    "use strict";
    var orm     = require('../index.js'),
        model   = require('../definition-files/public_cart.js'),
        util    = require('../utils.js')(model),
        Seq     = orm.Sequelize();

    module.exports = model;

    util.getAttribute('id').validate = {... Some Sequelize Validations}; // Add Sequelize validation.
    util.getRelation('relatedProducts').details.as = 'soldItems';        // Don't like default relation name? Change it.
    util.renameAttribute('customerId', 'clientId');                      // Change name of the attribute.

### Exclude Tables

It is possible to exclude some table from auto generation. (Config generate.skipTable:[]) array is used to define excluded tables. sequelize-pg-generator skips those tables and relations from and to those tables.

### Debug

When required and executed first time from your app, default index.js file creates a file called debug.js in the model directory. This file can be examined what type of code is used by index.js. It is same code that would be used if there is no index.js file exists. However if this type of static file is used, it is harder to allow modifications in a non-destructive way.

### Validates and Prevents Naming Clash
sequelize-pg-generator prevents naming clas by validating all relation names if same name/alias exists on the same table.

### Table Specific Configuration

Sometimes for some tables it is needed to have different rules then other tables have. In such situations configuration file allows table level overrides. All 'generate' and 'tableOptions' config parameters can be overridden with 'generateOverride' and 'tableOptionsOverride'.

Below is an example for contact table have specific configuration overrides.

    "generate": {
        "columnDescription": true,
        "tableDescription": true,
        ...
    },
    "generateOverride": {
        "contact": {
            "tableDescription": false
        }
    },
    "tableOptions": {
        "timestamps": false,
        "camelCase": true,
        "paranoid": false,
        ...
    },
    "tableOptionsOverride": {
        "contact": {
            "paranoid": true
        }
    }
    ...

Configuration
=============
Configuration parameters and default values are described below. Configuration is enclosed in "sequelize-pg-generator" key, because you may want to combine sequelize-pg-generator configuration with your main application configuration. This way generator's configuration does not clash with yours. [node-config](https://www.npmjs.com/package/node-config) allows this.

<table>
    <tr>
        <td colspan="3"><h4><strong>database</strong></h4></td>
    </tr>
    <tr>
        <td width="130">host</td>
        <td width="85">string</td>
        <td>IP address or host name of the database server.</td>
    </tr>
    <tr>
        <td>port</td>
        <td>number</td>
        <td>Port of database server to connect.</td>
    </tr>
    <tr>
        <td>database</td>
        <td>string</td>
        <td>Database name.</td>
    </tr>
    <tr>
        <td>user</td>
        <td>string</td>
        <td>Username to connect to database.</td>
    </tr>
    <tr>
        <td>password</td>
        <td>string</td>
        <td>Password to connect to database.</td>
    </tr>
    <tr>
        <td>schema</td>
        <td>Array(string)</td>
        <td>Array of names of the database schemas to be parsed.</td>
    </tr>
    <tr>
        <td colspan="3"><h4><strong>template</strong></h4></td>
    </tr>
    <tr>
        <td>engine</td>
        <td>string</td>
        <td>Template engine to use for generating model files. Any [consolidate](https://www.npmjs.com/package/consolidate) compatible template engine can be used.</td>
    </tr>
    <tr>
        <td>extension</td>
        <td>string</td>
        <td>Extension of template files.</td>
    </tr>
    <tr>
        <td>folder</td>
        <td>string</td>
        <td>Path of the template directory which contains template files.</td>
    </tr>
    <tr>
        <td colspan="3"><h4><strong>output</strong></h4></td>
    </tr>
    <tr>
        <td>log</td>
        <td>boolean</td>
        <td>Generate log during auto-generation to console.</td>
    </tr>
    <tr>
        <td>folder</td>
        <td>string</td>
        <td>Path to output directory for generated model files.</td>
    </tr>
    <tr>
        <td>beautify</td>
        <td>boolean</td>
        <td>Format code nicely with [js-beautifier](http://jsbeautifier.org).</td>
    </tr>
    <tr>
        <td>indent</td>
        <td>number</td>
        <td>Number of spaces used for each indentation level in generated files.</td>
    </tr>
    <tr>
        <td>preserveNewLine</td>
        <td>boolean</td>
        <td>Preserve new lines coming from templates during generation.</td>
    </tr>
    <tr>
        <td>warning</td>
        <td>boolean</td>
        <td>If set true, generator includes informative warning text inside generated files. This text is about how to customize and override default models.</td>
    </tr>
    <tr>
        <td colspan="3"><h4><strong>generate</strong></h4></td>
    </tr>
    <tr>
        <td>stripFirstTableFromHasMany</td>
        <td>boolean</td>
        <td>If this is set true. Generator strips first table name from has many relations' name if it begins with table name. For example "product_cart_line_items" relation becomes "cart_line_items" for "product" table.</td>
    </tr>
    <tr>
        <td>addTableNameToManyToMany</td>
        <td>boolean</td>
        <td>If this is set true. Generator adds name of the join table to many to many relationships. This prevents name collision.</td>
    </tr>
    <tr>
        <td>addRelationNameToManyToMany</td>
        <td>boolean</td>
        <td>If this is set true. Generator adds name of the relation to many to many relationships. This prevents name collision further than addTableNameToManyToMany, because more than two table can be connected to join table.</td>
    </tr>
    <tr>
        <td>stripFirstTableNameFromManyToMany</td>
        <td>boolean</td>
        <td>If this is set true. Generator strips first table name from many to many relations' name if it begins with table name. For example "product_cart_line_items" relation becomes "cart_line_items" for "product" table.</td>
    </tr>
    <tr>
        <td>hasManyThrough</td>
        <td>boolean</td>
        <td>Tells generator to generate has many through relations like hasMany(modelName, { through: '..' }. After Sequelize version 2.0 RC3 has many through relations are DEPRECATED. Use belongToMany instead. hasMany through and belongsToMany cannot be true at the same time for the same table.</td>
    </tr>
    <tr>
        <td>belongsToMany</td>
        <td>boolean</td>
        <td>Tells generator to generate belongsToMany relations which comes to Sequelize version 2.0 RC4. Prior Sequelize versions do not work if this option set true. hasMany through and belongsToMany cannot be true at the same time for the same table.</td>
    </tr>
    <tr>
        <td>prefixForBelongsTo</td>
        <td>string</td>
        <td>belongsTo relations use foreign key name "_id" suffix stripped. If foreign key does not contain "_id" suffix, generator add this prefix to belongsTo relations to prevent column accessor and relation accessor clash. See "Smart Naming of Models and Relations" section above.</td>
    </tr>
    <tr>
        <td>useSchemaName</td>
        <td>boolean</td>
        <td>If this is set true, generator adds schema name beginning of generated file names and model names. This is useful for multi schema databases for preventing same table name from clashing.</td>
    </tr>
    <tr>
        <td>modelCamelCase</td>
        <td>boolean</td>
        <td>Use camel case (like schemaName) in schema names.</td>
    </tr>
    <tr>
        <td>relationAccessorCamelCase</td>
        <td>boolean</td>
        <td>Use camel case (like relationName) in relation accessor names.</td>
    </tr>
    <tr>
        <td>columnAccessorCamelCase</td>
        <td>boolean</td>
        <td>Use came case (like columnName) in column accessor names.</td>
    </tr>
    <tr>
        <td>columnDefault</td>
        <td>boolean</td>
        <td>Generate default values to the model. WARNING: Does not support SQL functions yet. It is hard to implement this in Sequelize way. IMHO it is best to leave that to DBMS. However you can set it true and override false generated SQL functions.</td>
    </tr>
    <tr>
        <td>columnDescription</td>
        <td>boolean</td>
        <td>Include column description in generated model files.</td>
    </tr>
    <tr>
        <td>columnAutoIncrement</td>
        <td>boolean</td>
        <td>Include auto increment option of attributes in generated model files.</td>
    </tr>
    <tr>
        <td>tableDescription</td>
        <td>boolean</td>
        <td>Include table description in generated model files.</td>
    </tr>
    <tr>
        <td>dataTypeVariable</td>
        <td>string</td>
        <td>Sequelize uses object variable to define data types like "Sequelize.BOOLEAN". This configuration parameter sets the name of the variable.</td>
    </tr>
    <tr>
        <td>skipTable</td>
        <td>Array(string)</td>
        <td>List of table names not to generate model files for.</td>
    </tr>
    <tr>
        <td colspan="3"><h4><strong>tableOptions</strong></h4>User can include any Sequelize.define options here. These options are directly passed to Sequelize.define. See Sequelize docs. Some examples:</td>
    </tr>
    <tr>
        <td>timestamps</td>
        <td>boolean</td>
        <td>Adds createdAt and updatedAt timestamps to the model.</td>
    </tr>
</table>

Default Configuration Settings
------------------------------
Default configuration settings are listed below:

    module.exports = {
        "sequelize-pg-generator": {
            "database": {
                "host": "127.0.0.1",
                "port": 5432,
                "user": "user",
                "password": "password",
                "database": "",
                "schema": ["public"]
            },
            "template": {
                "engine": "swig",
                "extension": "html",
                "folder": path.join(__dirname, '..', 'template')
            },
            "output": {
                "log": true,
                "folder": "./model",
                "beautify": true,
                "indent": 4,
                "preserveNewLines": false,
                "warning": true
            },
            "generate": {
                "stripFirstTableFromHasMany": true,
                "addTableNameToManyToMany": false,
                "addRelationNameToManyToMany": true,
                "stripFirstTableNameFromManyToMany": true,
                "hasManyThrough": false,
                "belongsToMany": true,
                "prefixForBelongsTo": "related",
                "useSchemaName": true,
                "modelCamelCase": true,
                "relationAccessorCamelCase": true,
                "columnAccessorCamelCase": true,
                "columnDefault": false,
                "columnDescription": true,
                "columnAutoIncrement": true,
                "tableDescription": true,
                "dataTypeVariable": "Seq",
                "skipTable": []
        },
            "tableOptions": {
                "timestamps": false
            }
        }
    };

CAVEAT: Singleton Nature of Configuration
-----------------------------------------
This module uses config module via require('config') for configuration. Config module is a singleton as of this writing, which returns same config object for each request. As a result subsequent calls in the same process return same configuration even configuration file changed and/or sequelize-pg-generator constructor called with different config file.

This is usually no problem since generator supposed to be called once in the same process. However this behaviour prevents testing. Additionally you may want to avoid this behavior whatever reason. To side step this, it is added "resetConfig" option to constructor. If it is set to true it resets and rereads configuration. To do this we clear config module from node cache. It is sub-optimal solution suggested by lorenwest in github issues section.

To activate this behavior just set resetConfig to true or from cli add --resetConfig:

    var generator = require('sequelize-pg-generator');
    generator(function (err) {
        if (err) { callback(err); }
    }, {
        database: 'my_database',
        resetConfig: true
    );

sequelize-pg-creator uses the code below:

    global.NODE_CONFIG = null;
    delete require.cache[require.resolve('config')];
    config = require('config');

Template Variables (Customizing Templates)
==========================================
To create custom templates user can copy default templates or create from scratch then configure "template.folder" to use newly created templates. 3 files are required: index.ext (.ext is whatever your template engine's extension is), index.js, utils.js.

index.js and utils.js files will be copied directly to target model directory. index.ext template is executed for each table to create model files.

Variables available to use in templates are listed below. Please note if a value is undefined, it's key is also is deleted to make it easy to iterate only defined values in templates.

<table>
    <tr>
        <td width="270"><strong>mainScript</strong></td>
        <td>Path to generated index.js file in target model directory.</td>
    </tr>
    <tr>
        <td><strong>warning</strong></td>
        <td>This value comes from configuration which indicates if user wants to include warning message about customizations in generated model files.</td>
    </tr>
    <tr>
        <td><strong>table</strong></td>
        <td>Table object which has table details, columns and relations etc.</td>
    </tr>
    <tr>
        <td>table.modelName</td>
        <td>Model name for table.</td>
    </tr>
    <tr>
        <td>table.tableName</td>
        <td>Name of the table.</td>
    </tr>
    <tr>
        <td>table.schema</td>
        <td>PostgreSQL schema name of the table</td>
    </tr>
    <tr>
        <td>table.comment</td>
        <td>Comment of the table.</td>
    </tr>
    <tr>
        <td>table.baseFileName</td>
        <td>Base part of the file name.</td>
    </tr>
    <tr>
        <td>SPECIAL</td>
        <td>Options from configuration file is also available under table. For example: table.timestamps</td>
    </tr>
    <tr>
        <td><strong>table.columns</strong></td>
        <td>Array which contains columns of the table.</td>
    </tr>
    <tr>
        <td>table.columns[n].source</td>
        <td>'generator' string. Indicates that this is generated by auto generator. If user needs to access manually modified parts, it is possible to use this field to filter out automatically generated parts.</td>
    </tr>
    <tr>
        <td>table.columns[n].type</td>
        <td>Sequelize type of the column.</td>
    </tr>
    <tr>
        <td>table.columns[n].accessorName</td>
        <td>Accessor name of column.</td>
    </tr>
    <tr>
        <td>table.columns[n].name</td>
        <td>Name of the column</td>
    </tr>
    <tr>
        <td>table.columns[n].primaryKey</td>
        <td>True if this column is a primary key.</td>
    </tr>
    <tr>
        <td>table.columns[n].autoIncrement</td>
        <td>True if this column is a auto increment column.</td>
    </tr>
    <tr>
        <td>table.columns[n].allowNull</td>
        <td>Boolean value to indicate if this column is allowed to have null values.</td>
    </tr>
    <tr>
        <td>table.columns[n].defaultValue</td>
        <td>Dafault value of column.</td>
    </tr>
    <tr>
        <td>table.columns[n].unique</td>
        <td>String value of unique key's name. Sequelize use unique key name to support composite unique keys. It also works for single column unique values.</td>
    </tr>
    <tr>
        <td>table.columns[n].comment</td>
        <td>Description of the column. This comes from database server.</td>
    </tr>
    <tr>
        <td>table.columns[n].references</td>
        <td>If this column has a reference, this value is the name of table which this column references to.</td>
    </tr>
    <tr>
        <td>table.columns[n].referencesKey</td>
        <td>If this column has a reference, this value is the name of foreign key which this column references to.</td>
    </tr>
    <tr>
        <td>table.columns[n].onUpdate</td>
        <td>On update value of the column. (SET NULL, CASCADE, RESTRICT etc.)</td>
    </tr>
    <tr>
        <td>table.columns[n].onDelete</td>
        <td>On delete value of the column. (SET NULL, CASCADE, RESTRICT etc.)</td>
    </tr>
    <tr>
        <td><strong>table.hasManies</strong></td>
        <td>Array which contains hasMany relations of the table. </td>
    </tr>
    <tr>
        <td>table.hasManies[n].type</td>
        <td>'hasMany' string which indicates relation type.</td>
    </tr>
    <tr>
        <td>table.hasManies[n].source</td>
        <td>'generator' string. Indicates that this is generated by auto generator. If user needs to access manually modified parts, it is possible to use this field to filter out automatically generated parts.</td>
    </tr>
    <tr>
        <td>table.hasManies[n].name</td>
        <td>Name of the relation in database server.</td>
    </tr>
    <tr>
        <td>table.hasManies[n].model</td>
        <td>Model name which this relation refers to.</td>
    </tr>
    <tr>
        <td>table.hasManies[n].as</td>
        <td>Alias for relation. This alias is used to access this relation from Sequelize.</td>
    </tr>
    <tr>
        <td>table.hasManies[n].targetSchema</td>
        <td>PostgreSQL schema name which this relation refers to.</td>
    </tr>
    <tr>
        <td>table.hasManies[n].targetTable</td>
        <td>Table name which this table refers to.</td>
    </tr>
    <tr>
        <td>table.hasManies[n].foreignKey</td>
        <td>Foreign key column name in the target table.</td>
    </tr>
    <tr>
        <td>table.hasManies[n].onDelete</td>
        <td>onDelete value from database.</td>
    </tr>
    <tr>
        <td>table.hasManies[n].onUpdate</td>
        <td>onUpdate value from database.</td>
    </tr>
    <tr>
        <td>table.hasManies[n].through</td>
        <td>If this is a through relationship (many to many) name of the join table. Through relations are DEPRECATED as of Sequelize 2.0 RC4.</td>
    </tr>
    <tr>
        <td><strong>table.belongsTos</strong></td>
        <td>Array which contains belongsTo relations of the table. </td>
    </tr>
    <tr>
        <td>table.belongsTos[n].type</td>
        <td>'belongsTo' string which indicates relation type.</td>
    </tr>
    <tr>
        <td>table.belongsTos[n].source</td>
        <td>'generator' string. Indicates that this is generated by auto generator. If user needs to access manually modified parts, it is possible to use this field to filter out automatically generated parts.</td>
    </tr>
    <tr>
        <td>table.belongsTos[n].name</td>
        <td>Name of the relation in database server.</td>
    </tr>
    <tr>
        <td>table.belongsTos[n].model</td>
        <td>Model name which this relation refers to.</td>
    </tr>
    <tr>
        <td>table.belongsTos[n].as</td>
        <td>Alias for relation. This alias is used to access this relation from Sequelize.</td>
    </tr>
    <tr>
        <td>table.belongsTos[n].targetSchema</td>
        <td>PostgreSQL schema name which this relation refers to.</td>
    </tr>
    <tr>
        <td>table.belongsTos[n].targetTable</td>
        <td>Table name which this table refers to.</td>
    </tr>
    <tr>
        <td>table.belongsTos[n].foreignKey</td>
        <td>Foreign key column name in this table regarding this relation.</td>
    </tr>
    <tr>
        <td>table.belongsTos[n].onDelete</td>
        <td>onDelete value from database.</td>
    </tr>
    <tr>
        <td>table.belongsTos[n].onUpdate</td>
        <td>onUpdate value from database.</td>
    </tr>
    <tr>
        <td><strong>table.belongsToManies</strong></td>
        <td>Array which contains belongsToMany relations of the table. belongsToMany relations are available in Sequelize 2.0 RC4 and newer versions. </td>
    </tr>
    <tr>
        <td>table.belongsToManies[n].type</td>
        <td>'belongsToMany' string which indicates relation type.</td>
    </tr>
    <tr>
        <td>table.belongsToManies[n].source</td>
        <td>'generator' string. Indicates that this is generated by auto generator. If user needs to access manually modified parts, it is possible to use this field to filter out automatically generated parts.</td>
    </tr>
    <tr>
        <td>table.belongsToManies[n].name</td>
        <td>Name of the relation in database server.</td>
    </tr>
    <tr>
        <td>table.belongsToManies[n].model</td>
        <td>Model name which this relation refers to.</td>
    </tr>
    <tr>
        <td>table.belongsToManies[n].as</td>
        <td>Alias for relation. This alias is used to access this relation from Sequelize.</td>
    </tr>
    <tr>
        <td>table.belongsToManies[n].targetSchema</td>
        <td>PostgreSQL schema name which this relation refers to.</td>
    </tr>
    <tr>
        <td>table.belongsToManies[n].targetTable</td>
        <td>Table name which this table refers to.</td>
    </tr>
    <tr>
        <td>table.belongsToManies[n].foreignKey</td>
        <td>Foreign key column name in join table referencing to this table.</td>
    </tr>
    <tr>
        <td>table.belongsToManies[n].otherKey</td>
        <td>Foreign key column name in join table referencing to target table.</td>
    </tr>
    <tr>
        <td>table.belongsToManies[n].onDelete</td>
        <td>onDelete value from database.</td>
    </tr>
    <tr>
        <td>table.belongsToManies[n].onUpdate</td>
        <td>onUpdate value from database.</td>
    </tr>
    <tr>
        <td>table.belongsToManies[n].through</td>
        <td>Name of the join table.</td>
    </tr>
    <tr>
        <td>table.relations</td>
        <td>Array which contains all relations combined of the table. This array contains hasMany relations, hasMany through ilişkileri, belongsTo relations, belongsToMany relations.</td>
    </tr>
</table>

Examples
========

Eager Loading
-------------
sequelize-pg-generator sets up relations with an "as". Otherwise multiple relations between same two tables collides. For example:

account has many contacts as primaryContacts (account -----< contact)

account has many contacts as secondaryContacts (account ----< contact)

In this case sequelize.js requires you to specify "as" alias in the "as" attribute during eager loading.

    account = orm.model('public.account'); // Can be configured without schema.
    contact = orm.model('public.contact'); // Can be configured without schema.
    account.findAll({ include: [ { model: contact, as: "primaryContacts" } ] }).then(function(data) {
        console.log(data[0].primaryContacts[0].name);
    });

API
===

## Modules
<dl>
<dt><a href="#module_lib/index">lib/index</a></dt>
<dd></dd>
</dl>
## Classes
<dl>
<dt><a href="#GeneratorUtil">GeneratorUtil</a></dt>
<dd></dd>
</dl>
<a name="module_lib/index"></a>
## lib/index
**Author:** Özüm Eldoğan  
<a name="exp_module_lib/index--module.exports"></a>
### module.exports(callback, options) ⏏
Generates model files for Sequelize ORM.

**Kind**: Exported function  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | Function to execute after completion of auto generation. callback(err) |
| options | <code>object</code> | Options to override configuration parameters from config file |
| options.host | <code>string</code> | IP address or host name of the database server |
| options.port | <code>number</code> | Port of database server to connect |
| options.database | <code>string</code> | Database name |
| options.user | <code>string</code> | Username to connect to database |
| options.password | <code>string</code> | Password to connect to database |
| options.schema | <code>Array</code> | List of comma separated names of the database schemas to traverse. Example public,extra_schema. |
| options.output | <code>string</code> | Output folder |
| options.config | <code>string</code> | Path of the configuration file |
| options.nolog | <code>boolean</code> | Don't output log of generated files. |
| options.resetConfig | <code>boolean</code> | Reset configuration via side-step solution to prevent singleton behaviour. (Not recomended for production) |

<a name="GeneratorUtil"></a>
## GeneratorUtil
**Kind**: global class  

* [GeneratorUtil](#GeneratorUtil)
  * [new GeneratorUtil(model)](#new_GeneratorUtil_new)
  * [.getRelation(as)](#GeneratorUtil+getRelation) ⇒ <code>Object</code>
  * [.getAttribute(name)](#GeneratorUtil+getAttribute) ⇒ <code>Object</code>
  * [.renameAttribute(oldName, newName)](#GeneratorUtil+renameAttribute)

<a name="new_GeneratorUtil_new"></a>
### new GeneratorUtil(model)

| Param |
| --- |
| model | 

<a name="GeneratorUtil+getRelation"></a>
### generatorUtil.getRelation(as) ⇒ <code>Object</code>
Searches and returns relation with the given alias. Alias is defined in sequelize options with parameter 'as'

**Kind**: instance method of <code>[GeneratorUtil](#GeneratorUtil)</code>  

| Param | Type | Description |
| --- | --- | --- |
| as | <code>string</code> | Alias of the relation. |

<a name="GeneratorUtil+getAttribute"></a>
### generatorUtil.getAttribute(name) ⇒ <code>Object</code>
Searches and returns relation with the given attribute. Alias is defined in sequelize options with parameter 'as'

**Kind**: instance method of <code>[GeneratorUtil](#GeneratorUtil)</code>  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of the attribute. |

<a name="GeneratorUtil+renameAttribute"></a>
### generatorUtil.renameAttribute(oldName, newName)
Searches and returns relation with the given attribute. Alias is defined in sequelize options with parameter 'as'

**Kind**: instance method of <code>[GeneratorUtil](#GeneratorUtil)</code>  
**Throws**:

- Will throw error if there is already an attribute with new name exists or attribute with oldName does not exists.


| Param | Type | Description |
| --- | --- | --- |
| oldName | <code>string</code> | Name of the attribute which it's name to be changed. |
| newName | <code>string</code> | New name of the attribute. |


---------------------------------------

<a name="History"></a>
History & Release Notes
=======================

Note
----
Version history for minimal documentation updates are not listed here to prevent cluttering.
Important documentation changes are included anyway.

0.6.0 / 2015-09-10
==================
* -t --templateName parameter added to spgen. This name is used to choose one of the builtin template directories.
* sequalize4 template added for protect backward compatibility.
* sequalize4 template supports object references property. (references and referencesKey will be depreciated in Sequelize 4)


0.5.4 / 2015-06-16
==================
* pg-structure updated to latest version.


0.5.3 / 2015-06-16
==================
* Added: JSONB support and Boolean default value. Contributed by viniciuspinto (https://github.com/viniciuspinto)

0.4.2 / 2015-04-27
==================
* Added documentation and examples.

0.3.1 / 2015-01-10
==================
* Tested for Sequelize 2.0 RC7

0.3.0 / 2014-12-30
==================
* Removed: pg-native dependency removed. Some users experienced problems during install.
* Added: generate.addRelationNameToManyToMany configuration to prefix relation aliases prevent further name clashes which cannot be prevented by generate.addTableNameToManyToMany. Default: true.
* Added: generate.stripFirstTableNameFromManyToMany configuration added. Default: true
* Changed: generate.addTableNameToManyToMany configuration default is false now.
* Changed: Default naming rule for many to many relations.
* Added: Logging uses Winston module now.
* Added: Doc update for Windows OS users.
* Fixed: Database tables without any column throws error when warning configuration is true.

0.2.0 / 2014-12-27
==================
* Added: Automatic alias and naming validations to prevent name clash.
* Added: generate.addTableNameToManyToMany configuration to prefix relation aliases prevent name clash. Default: true.
* Added: --throwError option added to CLI. This option decides wheter to throw error or simply log.
* Added: Prevent hasMany through and belongsToMany true at the same time.
* Fixed: generate.prefixForBelongsTo aliases are not properly camel cased.
* Fixed: --resetConfig option does not work from CLI
* Doc update

0.1.17 / 2014-12-26
===================
* Fixed: CLI command does not work.
* Added: Required parameters warning.

0.1.15 / 2014-12-26
===================
* Added: Turkish documentation added.
* Fixed: Typos and mistakes in documents.

0.1.12 / 2014-12-23
===================
* Added: Tests added.
* Added: --nolog option added to spgen command.
* Added: --resetConfig option. Also details and caveat added to the document.
* Fix: lib/index.js exported function expects different parameters than written in documentation.
* Fix: Command line arguments fixed.
* Fix: Data type variable name configuration is ignored.
* Document update.

0.1.0 / 2014-12-23
==================
* Initial version.

The MIT License (MIT)

Copyright (c) 2014 Özüm Eldoğan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

