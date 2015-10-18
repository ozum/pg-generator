
---------------------------------------

<a name="History"></a>
History & Release Notes
=======================

Note
----
Version history for minimal documentation updates are not listed here to prevent cluttering.

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

