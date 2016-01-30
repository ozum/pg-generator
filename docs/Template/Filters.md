#  Template Filters

Filters are essentially functions that can be applied to variables. They are called with a pipe operator (|) and can take arguments. [nunjucks](https://mozilla.github.io/nunjucks/) filters alter output of variables in place. You can use all available builtin [nunjucks filters](https://mozilla.github.io/nunjucks/templating.html#builtin-filters). 

    {{ table.name | lower }} -> Converts name to lower case. (i.e. Member -> member)
    
They can be chained:

    {{ table.name | plural | camelCase }} -> Converts name to plural in camel case. (i.e. member_name -> memberNames)
    
#### pg-generator filters
    
pg-generator offfers additional filters suitable for database scaffolding. Some of them are based on highly popular [inflection](https://www.npmjs.com/package/inflection) npm module.

| Filter Name | Description | Before | After |
|-------------|----------  -|--------|-------|
| camelCase | Converts string to camelcase. | member_name | memberName |
| pascalCase | Converts string to pascal case. | member_name | MemberName |
| classCase | Converts string to class case. | member_name | MemberName |
| snakeCase | Converts string to snake case. | memberName | member_name |
| singular | Converts string to singular. | member_names | member_name |
| plural | Converts string to plural. | member_name | member_names |
| clearDefault | Clears PostgreSQL default values to be used in JS code. | "O''Reilly" | "O'Reilly" |
| quote | Adds quotes to string using `JSON.stringify`. | member_name | "member_name" |
| singleQuote | Adds single quotes to string. | member_name | 'member_name' |
| stripPrefix(arg1, arg2, ...) | Strips given texts and `object.name`s from beginning of string. | cart_cart_id<sup>1</sup> | cart_id
| stripSuffix(arg1, arg2, ...) | Strips given texts and `object.name`s from end of string. | cart_id<sup>2</sup> | cart
| strip(arg1, arg2, ...) | Strips given texts and `object.name`s from string. | cart_product_id<sup>3</sup> | cart_id
| padRight(length, [char]) | Pads string with optional char (default space) until it's length equals to length. | member<sup>4</sup> | member......
| relationName | Converts foreign key name to be used in a relationship. If string ends with '_id' or 'id', strips it (case insensitive). Otherwise adds given prefix at the beginning of the string. | company_id, account | company related_account

***** Footnotes

    *1 {{ 'cart_cart_id'    | stripPrefix('cart') }}        -> cart_id
       {{ 'cart_cart_id'    | stripPrefix(cart_table) }}    -> cart_id (Assuming cart_table.name equals cart)
       {{ 'a_b_c_table'     | stripPrefix('a', 'b') }}      -> c_table
    *2 {{ 'cart_id'         | stripSuffix('id') }}          -> cart
    *3 {{ 'cart_product_id' | strip('product') }}           -> cart_id
    *4 {{ 'member'          | padRight(10) }}               -> member    <- Space padded until here.
       {{ 'member'          | padRight(10, '_') }}          -> member____

## API of Filter Functions

### clearDefault(string) ⇒ <code>string</code> &#124; <code>boolean</code> &#124; <code>undefined</code>
Clears SQL type escapes (Two quote '' to one quote ') and strips beginning and trailing quotes around string.
Also escapes result according to JSON standards.
 
**Returns**: <code>string</code> &#124; <code>boolean</code> &#124; <code>undefined</code> - - Default value to use in template.  

| Param | Type | Description |
| --- | --- | --- |
| string | <code>string</code> | Default value returned from PostgreSQL. |

<a name="relationName"></a>
### relationName(str, [prefix]) ⇒ <code>string</code>
Converts foreign key name to be used in a relationship. If string ends with '_id' or 'id', strips it (case insensitive).
Otherwise adds given prefix at the beginning of the string. company_id -> company, account -> related_account
 
**Returns**: <code>string</code> - - Name for the belongsTo relationship.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| str | <code>string</code> |  | Foreign key name. |
| [prefix] | <code>string</code> | <code>&quot;related&quot;</code> | Prefix to add if no given string does not contain 'id'. |

<a name="stripPrefix"></a>
### stripPrefix(source, arguments) ⇒ <code>string</code>
Variadic function which strips given list of strings or object's names from start of the source string.
 
**Returns**: <code>string</code> - - Cleaned string.  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>string</code> | Source string to be cleaned. |
| arguments | <code>string</code> &#124; <code>Object</code> | List of strings or objects (object's names) to delete from source string. |

<a name="stripSuffix"></a>
### stripSuffix(source, arguments) ⇒ <code>string</code>
Variadic function which strips given list of strings or object's names from end of the source string.
 
**Returns**: <code>string</code> - - Cleaned string.  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>string</code> | Source string to be cleaned. |
| arguments | <code>string</code> &#124; <code>Object</code> | List of strings or objects (object's names) to delete from source string. |

<a name="padRight"></a>
### padRight(str, count, [char]) ⇒ <code>string</code>
Pads given string's right side with given character (default space) to complete its length to count.
 
**Returns**: <code>string</code> - - Result string with length of count.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| str | <code>string</code> |  | Source string. |
| count | <code>number</code> |  | Total length of the result string. |
| [char] | <code>string</code> | <code>&quot;space&quot;</code> | Padding character |

