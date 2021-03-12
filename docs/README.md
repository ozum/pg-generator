---
home: true
heroImage: /images/hero.png
heroText: PostgreSQL Scaffolding
tagline: Never write database-related files by hand again!
actionText: Get Started →
actionLink: /nav.01.guide/
features:
  - title: Zero-Config
    details: Works out of the box. If you need it, you can customize the most important parts such as relation names.
  - title: Any Template Engine
    details: You can use your favorite template engine! pg-generator is template engine agnostic.
  - title: CLI & API
    details: pg-generator can be used via "pgen" command or directly in Node.js as a library.
footer: MIT Licensed | Copyright © 2019-present Özüm Eldoğan
---

### Install

```bash
$ npm install -g pg-generator pg-generator-example
```

### Generate Models & Files

Generate your _models, files, reports, documentation_ easily from your PostgreSQL database. Using [pg-structure](https://www.pg-structure.com), pg-generator reverse engineers your database and executes templates for each corresponding database object.

```bash
$ pgen example --outDir models --clear --database db --user user --password password
```

### Create Your Generators

Create your generators exactly tailored to fit your needs and publish them to npm. All you need is to add your templates and extend [PgGenerator](/nav.02.api/classes/pggenerator.html#class-pggenerator-o) class with a [render](/nav.02.api/classes/pggenerator.html#render) method that renders given template and context data using your favorite template engine.

```bash
$ pgen-scaffold nunjucks --outDir my-project
```
