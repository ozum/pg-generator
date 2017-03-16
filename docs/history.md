
# History & Release Notes

**Note**: Version history for minimal documentation updates are not listed here to prevent cluttering.

###### 3.5.0 / 2017-03-16
* Added: eslint --fix feature added with `lintFix` option. If it is set to true and eslint command is available,
generated files are fixed with eslint according to .eslintrc or settings in your project.

###### 3.4.14 / 2017-02-21
* Fixed: Empty and numeric default values were generated wrong. 

###### 3.4.6 / 2016-12-8

* Custom data `attributeName` added for `sequelize` template. [#38](https://github.com/ozum/pg-generator/issues/38).

###### 3.4.5 / 2016-11-17
* SSL option added to CLI. Thanks to [gbahamondezc](https://github.com/gbahamondezc).

###### 3.4.2 / 2016-08-17
* Added: `singleLine` nunjucks filter added.
* Fixed: Multi line database comments throw exception.

###### 3.4.0 / 2016-06-27
* Added: `-nobeautifier` CLI option added.
* Added: `beautifier` option added.

###### 3.3.0 / 2016-05-05
* Added: Objection template can be used with custom objection.Model subclass.
* Changed: Objection template is simplified. Still in alpha stage.
* Changed: Documentation update.

###### 3.2.4 / 2016-03-22
* Fixed: Template file names contain pipe `|` character for filtering. It's an invalid character in windows file names.
Now `#` is used for filtering. For backward compatibility `|` can still be used. 

###### 3.2.0 / 2016-02-22
* Added: New template 'objection-alpha' added. As name suggests, it is in alpha stage, needs some feedback.

###### 3.1.0 / 2016-02-22
* Added: `hasOne` relation support for `Sequelize` template.

###### 3.0.2 / 2016-02-19
* Changed: pg-structure updated to 3.1.3 to make pg-generator compatible with node.js v4 without --harmony flag.

###### 3.0.1 / 2016-02-18
* Added: stringifyIfObject filter, which converts it's input to string if it is an object.
* Changed: `sequelize` template expands custom data objects automatically.

###### 3.0.0 / 2016-01-30
* Changed: pg-structure is updated to v3.1.2
* Changed: pg-structure v3 returns collections ad Map and Set instead of Object or Array. Templates are updated as necessary.

###### 2.0.18 / 2015-12-28
* Added: PostgreSQL range data types for sequelize template.
* Added: sequelize template throws more explanatory error for unknown/undefined data types.

###### 2.0.17 / 2015-12-09
* Added: Additional test for sequelize template, which compares generated file with an expected result.  
* Fixed: Sequelize template did not generate table description.
* Changed: pg-structure module updated to v2.0.8.

###### 2.0.7 / 2015-11-29
* Changed: pg-structure updated to version 2.0.0-alpha.9

###### 2.0.6 / 2015-11-29
* Changed: pg-structure module updated.

###### 2.0.0 / 2015-11-25
* Completely rewritten from scratch.
* CAUTION: 2.0.0 is incompatible with 0.x series.
* Added: For sequelize-pg-generator users, better direct usable generated files compared to sequelize-pg-generator. pg-generator all features and more.
* Renamed from sequelize-pg-generator to pg-generator.
* Added: Updated pg-structure v2 API.
* Added: Template based generation. Not limited to sequelize.
* Added: [www.pg-generator.com](http://www.pg-generator.com) web site.
* Added: Interactive command line.
* Added: 3 templates. (Sequelize, base and tutorial)
* Removed: Configuration files. Templates are easier and more intuitive than config files.
* Changed: Command changed from 'spgen' to 'pgen'. 
* Changed: Makefile to npm scripts.

###### 0.9.0
* Added: sequelize-types are added. (pg-structure deprecated it.)

###### 0.8.0 / 2015-10-14
* Added: `alias.json` file is generated in target directory to let developer easily override relationship names.

###### 0.7.0 / 2015-10-14
* Changed: Location of utils.js is changed to inside of model directory.

###### 0.6.0 / 2015-09-10
* -t --templateName parameter added to spgen. This name is used to choose one of the builtin template directories.
* sequalize4 template added for protect backward compatibility.
* sequalize4 template supports object references property. (references and referencesKey will be depreciated in Sequelize 4)

###### 0.5.4 / 2015-06-16
* pg-structure updated to latest version.

###### 0.5.3 / 2015-06-16
* Added: JSONB support and Boolean default value. Contributed by viniciuspinto (https://github.com/viniciuspinto)

###### 0.4.2 / 2015-04-27
* Added documentation and examples.

###### 0.3.1 / 2015-01-10
* Tested for Sequelize 2.0 RC7

###### 0.3.0 / 2014-12-30
* Removed: pg-native dependency removed. Some users experienced problems during install.
* Added: generate.addRelationNameToManyToMany configuration to prefix relation aliases prevent further name clashes which cannot be prevented by generate.addTableNameToManyToMany. Default: true.
* Added: generate.stripFirstTableNameFromManyToMany configuration added. Default: true
* Changed: generate.addTableNameToManyToMany configuration default is false now.
* Changed: Default naming rule for many to many relations.
* Added: Logging uses Winston module now.
* Added: Doc update for Windows OS users.
* Fixed: Database tables without any column throws error when warning configuration is true.

###### 0.2.0 / 2014-12-27
* Added: Automatic alias and naming validations to prevent name clash.
* Added: generate.addTableNameToManyToMany configuration to prefix relation aliases prevent name clash. Default: true.
* Added: --throwError option added to CLI. This option decides wheter to throw error or simply log.
* Added: Prevent hasMany through and belongsToMany true at the same time.
* Fixed: generate.prefixForBelongsTo aliases are not properly camel cased.
* Fixed: --resetConfig option does not work from CLI
* Doc update

###### 0.1.17 / 2014-12-26
* Fixed: CLI command does not work.
* Added: Required parameters warning.

###### 0.1.15 / 2014-12-26
* Added: Turkish documentation added.
* Fixed: Typos and mistakes in documents.

###### 0.1.12 / 2014-12-23
* Added: Tests added.
* Added: --nolog option added to spgen command.
* Added: --resetConfig option. Also details and caveat added to the document.
* Fix: lib/index.js exported function expects different parameters than written in documentation.
* Fix: Command line arguments fixed.
* Fix: Data type variable name configuration is ignored.
* Document update.

###### 0.1.0 / 2014-12-23
* Initial version.

