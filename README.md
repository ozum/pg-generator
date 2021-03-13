<div align="center"><img src="https://raw.githubusercontent.com/ozum/pg-generator/master/docs/.vuepress/public/images/hero.png" alt="pg-generator logo"/></div>
<div align="center" style="font-size:3rem; font-weight: 600;">PostgreSQL Scaffolding</div>
<div align="center" style="font-size:1.6rem; color:#6a8bad; ">Never write database-related files by hand again!</div>
<div align="center" style="margin-top:20px;">
  pg-generator is an open-source, zero-config CLI & API scaffolding tool for PostgreSQL. <br/>
  It generates files from your database structure using templates.
</div>

# v5 is at the Alpha Satge

The new major version is at the alpha stage. Any feedback is appreciated.

# Documentation

Please see documenatation at [pg-generator.com](https://www.pg-generator.com)

# Installation

```bash
$ npm install -g pg-generator@5.0.0-alpha.8 pg-generator-example
```

# Generate Models & Files

Generate your _models, files, reports, documentation_ easily from your PostgreSQL database. Using [pg-structure](https://www.pg-structure.com), pg-generator reverse engineers your database and executes templates for each corresponding database object.

```bash
$ pgen example --outDir models --clear --database db --user user --password password
```

# Create Your Generators

Create your generators exactly tailored to fit your needs and publish them to npm. All you need is to add your templates and extend [PgGenerator](/nav.02.api/classes/pggenerator.html#class-pggenerator-o) class with a [render](/nav.02.api/classes/pggenerator.html#render) method that renders given template and context data using your favorite template engine.

```bash
$ pgen-scaffold nunjucks --outDir my-project
```
