# Utility Funtions

`pg-generator` provides some utility functions.

## Schema Generating Utilities

Schema generating utilites generates schemas for common basic needs. If you need custom functionality, you should do it in template manuanlly.

Signature of functions are as below:

**schemaFunction(table, options)**

| Name                           | Type     | Default | Description                                           |
| ------------------------------ | -------- | ------- | ----------------------------------------------------- |
| table                          | Object   |         | pg-structure table object                             |
| [options]                      | Object   |         | Options                                               |
| [options.exclude]              | string[] |         | Array of column names to exclude                      |
| [options.jsonAsString]         | boolean  | `false` | Whether json and jsonb types are expected as a string |
| [options.defaultValueOptional] | boolean  | `false` | Whether to make columns with default values optional  |

### pgen.tableJsDocSchema

Generates JSDoc documentation for given table.

Example usage in template:

```jinja2
/**
 * {{ table.schema.name }}.{{ table.name }}
{{ table.description | makeJsDoc }}
{{ pgen.tableJsDocSchema(table) -}}
 */
```

### pgen.tableTypeScriptSchema

Generates TypeScript types for given table.

Example usage in template:

```jinja2
class {{ table.name | classCase }} extends Model {
  {{ pgen.tableTypeScriptSchema(table) }}
}
```

### pgen.tableJoiSchema

Generates `Joi` schema for given table.

```jinja2
Joi.object({
  {{ pgen.tableJoiSchema(table) | stringifyIfObject(raw = true) }}
});
```

### pgen.tableJsonSchema

Generates JSON Schema for given table.

```jinja2
{{ pgen.tableJsonSchema(table) | stringifyIfObject }};
```
