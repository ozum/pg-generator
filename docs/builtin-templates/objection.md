# ALPHA STAGE
This template is in alpha stage. Feedback needed.

## Usage

Create template and model files:

    $ pgen template objection -t objection-alpha-template
    $ pgen exec objection-alpha-template -d our_crm -u user -p tOpSeCrEt -t model

In your application, create a sequelize object and initialize models with it:

```js
var Knex    = require('knex');
var knex    = new Knex({client: 'pg', connection: { database: 'our_crm', user: 'user',  password: 'tOpSeCrEt' }});
var model   = require('./model/index.js').init(knex); // You only need to init once. You can just require later.

model.Company.query()
    .then(function(companies) {
        console.log(companies[0].name);
    })
    .catch(function(error) {
        console.log(err.stack);
    });
```

## Features & Targets (Some are not implemented yet):

* Generated model files are as similar as possible to official Objection documents.
* Created files are static and transparent. They are not used to create models dynamically. So debugging and seeing what is generated is very easy for humans.
* Documented,
* Tested,
* No Dependencies on generated files,
* Multi schema support,
* One to many relation support (hasMany and belongsTo),
* Many to many relation support (belongsToMany),
* Inter-schema relation support. (i.e. public.account table to other_schema.cutomer table),
* Default smart naming of models and relations,
* Very easy to override auto generated files,
