---
home: true
heroImage: /images/hero.png
heroText: PostgreSQL Scaffolding
tagline: Never write database related files by hand again!
actionText: Get Started →
actionLink: /nav.01.guide/
features:
  - title: Generate Files
    details: Execute template files for each PostgreSQL database object. From tables to check constraints.
  - title: Any Template Engine
    details: You can use your favorite template engine! pg-generator is template engine agnostic.
  - title: Zero-Config
    details: No configuration needed. If you need it, you can easily customize the most important parts.
footer: MIT Licensed | Copyright © 2019-present Özüm Eldoğan
---

### Install & Generate Models

```bash
$ npm install -g pg-generator pg-generator-example
$ pgen example --outDir models --clear --database db --user user --password password
$ pgen example:objection2 --outDir models --clear --database db --user user --password password
```

Create your _model files, reports, documentation_ easily from your PostgreSQL database. Using [pg-structure](https://www.pg-structure.com) under the hood, pg-generator reverse engineers your PostgreSQL database and executes templates for each corresponding database object to generate your files.

### Create Your Generators
