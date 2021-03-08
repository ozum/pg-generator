# Filters

If your favorite template engine supports, pg-generator provides some built-in filters to be added to the template engine. Filters are JS functions.

## Adding Filters

Below is examples showing how to add filters to the [nunjucks](https://mozilla.github.io/nunjucks/) templating engine. Nunjucks already has some [built-in filters](https://mozilla.github.io/nunjucks/templating.html#builtin-filters). We will add our filters.

## Adding pg-generator Built-In Filters

Please see [built-in filters](/nav.02.api/modules/filterfunctions) for all available filters.

```ts
import { join } from "path";
import { filterFunctions } from "pg-generator";
import nunjucks, { Environment } from "nunjucks";

const environment = new nunjucks.FileSystemLoader(join(__dirname, "templates"));
Object.entries(filters).forEach(([name, filter]) => environment.addFilter(name, filter));
```

## Adding Custom Filters

It is a best practice to move complex operations into your custom filters, and leave as few business logic as possible to templates. This also makes your complex operations easy to test, debug and share.

```ts
import { join } from "path";
import nunjucks, { Environment } from "nunjucks";

const customFilters = {
  hello: (input) => `Hello! ${input}`,
};

const environment = new nunjucks.FileSystemLoader(join(__dirname, "templates"));
Object.entries(customFilters).forEach(([name, filter]) => environment.addFilter(name, filter));
```

## Ready to Use Function

Below is an example function which combines the examples above and ready to be used in your generators.

```ts
import { join } from "path";
import { filterFunctions } from "pg-generator";
import nunjucks, { Environment } from "nunjucks";

/** Custom filters example */
const customFilters = {
  /** Adds hello at the beginning of its input. */
  hello: (input) => `Hello! ${input}`,
  /** Filters can be used for object stoo. Below filter returns non-serial required columns. */
  requiredColumns: (table) => table.columns.filter((column) => !column.isSerial && column.notNull),
};


/**
 * This function is not related to `pg-generator`. It creates `nunjucks` template engine environment
 * for the given generator and adds filters provided by `pg-generator`.
 * `pg-generator` is template agnostic, you can use any template engine.
 *
 * @param generatorPath is the path of the generator.
 *
 * @see https://mozilla.github.io/nunjucks
 */
export function getNunjucks(generatorPath: string): Environment {
  // Create `nunjucks` environment.
  const environment = new nunjucks.Environment(
    // Add given sub-generator path and shared "partials" path to the list of template paths.
    new nunjucks.FileSystemLoader([join(generatorPath, "templates"), join(__dirname, "../partials")]),
    { autoescape: false }
  );

  // Add pg-generator built-in filters and custom filters to nunjucks.
  // Filters are not nunjucks specific, many template engines have a similar mechanism.
  const filters = { ...filterFunctions, ...customFilters };
  Object.entries(filters).forEach(([name, filter]) => environment.addFilter(name, filter));

  return environment;
```