## Functions

<dl>
<dt><a href="#allData">allData(db)</a> ⇒ <code>Object</code></dt>
<dd><p>Object returned from this function will be merged with template variables and available in every template file.
This function is executed for each generated file.</p>
</dd>
<dt><a href="#dbData">dbData(db)</a> ⇒ <code>Object</code></dt>
<dd><p>Object returned from this function will be merged with template variables and available in templates located in
db directory. This function is executed for each generated file resulted from templates in db directory.</p>
</dd>
<dt><a href="#schemaData">schemaData(schema)</a> ⇒ <code>Object</code></dt>
<dd><p>Object returned from this function will be merged with template variables and available in templates located in
schema directory. This function is executed for each generated file resulted from templates in schema directory.</p>
</dd>
<dt><a href="#tableData">tableData(table)</a> ⇒ <code>Object</code></dt>
<dd><p>Object returned from this function will be merged with template variables and available in templates located in
table directory. This function is executed for each generated file resulted from templates in table directory.</p>
</dd>
</dl>
<a name="allData"></a>
## allData(db) ⇒ <code>Object</code>
Object returned from this function will be merged with template variables and available in every template file.
This function is executed for each generated file.

**Kind**: global function  
**Returns**: <code>Object</code> - - Object to be merged with template variables.

| Param | Type                        | Description                                                    |
| ----- | --------------------------- | -------------------------------------------------------------- |
| db    | <code>pgStructure.db</code> | [pg-structure db object](http://www.pg-structure.com/api/DB/). |

<a name="dbData"></a>

## dbData(db) ⇒ <code>Object</code>

Object returned from this function will be merged with template variables and available in templates located in
db directory. This function is executed for each generated file resulted from templates in db directory.

**Kind**: global function  
**Returns**: <code>Object</code> - - Object to be merged with template variables.

| Param | Type                        | Description                                                    |
| ----- | --------------------------- | -------------------------------------------------------------- |
| db    | <code>pgStructure.db</code> | [pg-structure db object](http://www.pg-structure.com/api/DB/). |

<a name="schemaData"></a>

## schemaData(schema) ⇒ <code>Object</code>

Object returned from this function will be merged with template variables and available in templates located in
schema directory. This function is executed for each generated file resulted from templates in schema directory.

**Kind**: global function  
**Returns**: <code>Object</code> - - Object to be merged with template variables.

| Param  | Type                            | Description                                                            |
| ------ | ------------------------------- | ---------------------------------------------------------------------- |
| schema | <code>pgStructure.schema</code> | [pg-structure schema object](http://www.pg-structure.com/api/Schema/). |

<a name="tableData"></a>

## tableData(table) ⇒ <code>Object</code>

Object returned from this function will be merged with template variables and available in templates located in
table directory. This function is executed for each generated file resulted from templates in table directory.

**Kind**: global function  
**Returns**: <code>Object</code> - - Object to be merged with template variables.

| Param | Type                           | Description                                                          |
| ----- | ------------------------------ | -------------------------------------------------------------------- |
| table | <code>pgStructure.table</code> | [pg-structure table object](http://www.pg-structure.com/api/Table/). |
