
# History & Release Notes

**Note**: Version history for minimal documentation updates are not listed here to prevent cluttering.

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

