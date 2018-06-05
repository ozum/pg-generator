# Utility

`pg-generator` provides some utility functions.

## Schema Generating Utilities

Schema generating utilites generates schemas for common basic needs. If you need custom functionality, you should do it in template manuanlly.

Signature of functions are as below:

**schemaFunction(table, options)**

- `table`: (Object) pg-structure table object
- `options`: (Object) Options
- `options.exclude`: (string[]) Array of column names to exclude

### pgen.tableJsDocSchema

Generates JSDoc documentation for given table.

Example usage in template:

```nunjucks
/**
 * {{ table.schema.name }}.{{ table.name }}
{{ table.description | makeJsDoc }}
{{ pgen.tableJsDocSchema(table) -}}
 */
```

### pgen.tableTypeScriptSchema

Generates TypeScript types for given table.

Example usage in template:

```nunjucks
class {{ table.name | classCase }} extends Model {
  {{ pgen.tableTypeScriptSchema(table) }}
}
```

### pgen.tableJoiSchema

Generates `Joi` schema for given table.

```nunjucks
Joi.object({
  {{ pgen.tableJoiSchema(table) | stringifyIfObject(raw = true) }}
});
```

### pgen.tableJsonSchema

Generates JSON Schema for given table.

```nunjucks
{{ pgen.tableJsonSchema(table) | stringifyIfObject }};
```
