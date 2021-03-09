# Introduction

## What is a Generator

Generators are pg-generator plugins developed as Node.js modules. pg-generator creates files for the database structure using generators. A generator contains one or more sub-generators. If generator name starts with "pg-generator", it can be used without prefix. `pgen example` command executes "pg-generator-example" plugin.

## What is a Sub-Generator

Sub generators are JavaScript files exporting a default class that extend [PgGenerator Class](/nav.02.api/classes/pggenerator.html) and have templates folder. You should put your sub-generators in their sub-folder in `lib`, `dist`, or `generators` folder.

The required default sub-generator name is `app`. When you execute `pgen name` command or `generate("name")` function without providing a sub-generator name, the `app` sub-generator is executed, which is located in the `app` sub-directory. You may add additional sub-generators and name them as you wish. The folder name is the name of the sub-generator.

Below is an example of a generator that has 3 sub-generators: `app`, `md`, and `orm`.

```
├─ package.json
└─ dist/
   ├─ app/
   ├─ md/
   ├─ orm/
```

| CLI             | API                       | Sub-Generator |
| --------------- | ------------------------- | ------------- |
| `pgen name`     | `generate("name")`        | `dist/app/`   |
| `pgen name:app` | `generate("name", "app")` | `dist/app/`   |
| `pgen name:md`  | `generate("name", "md")`  | `dist/md/`    |
| `pgen name:orm` | `generate("name", "orm")` | `dist/orm/`   |

## Templates

Template files are located in the `templates` folder of a sub-generator. Any templating engine can be used. Generated files are created by processing the templates. pg-generator decides how to process a template and what to pass as context data using the template's file name. Please see [templates section](/nav.03.creating-generators/02.templates) for details.

Templates related to the database objects are processed for each database object they are related to. Other files in the templates folder are copied to the destination without any processing.

For example:

```
├─ package.json
└─ dist/
   └─ app/
      └─ templates/
         ├─ [table] {name}.js.njk
         └─ README.md
```

The `[table] {name}.js.njk` template is processed for each table. As a result, a JavaScript file is created for each database table. On the other hand, `README.md` is not processed and just copied to the destination.

## Processed Files

| P   | Path                         | Notes                                                                                                                             |
| --- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
|     | `dist/partials/`             | This folder may be used to store partial template files shared between several sub-generators.                                    |
|     | `dist/utils/`                | This folder may be used to store utility code.                                                                                    |
| ✔   | `dist/*/`                    | Any other folders are used as a sub-generator (e.g. `dist/app`, `dist/report`).                                                   |
| ✔   | `dist/*/templates/`          | Template files corresponding to database objects are processed for each object. Non-template files are copied to the destination. |
|     | `dist/*/templates/partials/` | This folder may be used to store partial template files for a specific sub-generator.                                             |

**✔**: pg-generator only processes files or folders marked with ✔. Other files and folders are ignored by the pg-generator and may be used for utility purposes or storing for template partials.

Below is an example of all files summarized above.

```
├─ package.json
└─ dist/
   ├─ partials/
   ├─ utils/
   ├─ app/
   │  ├─ index.js
   │  └─ templates/
   │     ├─ partials/
   │     ├─ README.md
   │     ├─ [db] index.js.njk
   │     └─ models/
   │        ├─ [table] {schema.name # dash-case}{name # dash-case}.js.njk
   │        └─ [view] {name # dash-case}.js.njk
   └─ report/
      ├─ index.js
      └─ templates/
         └─ [db] report.md.njk
```

Above structure provide `pgen name` and `pgen name:report` in CLI, as well as `generate("name")` and `generate("name", "report")` functions in API.
