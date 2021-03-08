# pg-generator

Template based scaffolding tool for PostgreSQL.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [Synopsis](#synopsis)
- [Details](#details)
- [API](#api)
  - [Table of contents](#table-of-contents)
    - [Namespaces](#namespaces)
    - [Classes](#classes)
    - [Interfaces](#interfaces)
  - [Type aliases](#type-aliases)
    - [Context](#context)
    - [Options](#options)
  - [Functions](#functions)
    - [generate](#generate)
- [Classes](#classes-1)
- [Class: PgGenerator<O\>](#class-pggeneratoro%5C)
  - [Type parameters](#type-parameters)
  - [Constructors](#constructors)
    - [constructor](#constructor)
  - [Methods](#methods)
    - [generate](#generate-1)
- [Interfaces](#interfaces-1)
- [Interface: ClientOptions](#interface-clientoptions)
  - [Hierarchy](#hierarchy)
  - [Properties](#properties)
    - [client](#client)
    - [connectionString](#connectionstring)
    - [database](#database)
    - [host](#host)
    - [password](#password)
    - [port](#port)
    - [ssl](#ssl)
    - [user](#user)
- [Interface: GeneratorOptions](#interface-generatoroptions)
  - [Properties](#properties-1)
    - [clear](#clear)
    - [context](#context)
    - [contextFile](#contextfile)
    - [log](#log)
    - [outDir](#outdir)
- [Modules](#modules)
- [Namespace: converters](#namespace-converters)
  - [Functions](#functions-1)
    - [mermaidToSVG](#mermaidtosvg)
- [Namespace: filterFunctions](#namespace-filterfunctions)
  - [Functions](#functions-2)
    - [camelCase](#camelcase)
    - [classCase](#classcase)
    - [clearDefault](#cleardefault)
    - [concat](#concat)
    - [dashCase](#dashcase)
    - [dboClassName](#dboclassname)
    - [dboColumnTypeModifier](#dbocolumntypemodifier)
    - [doubleQuote](#doublequote)
    - [fill](#fill)
    - [human](#human)
    - [lcFirst](#lcfirst)
    - [linePrefix](#lineprefix)
    - [listAttribute](#listattribute)
    - [maxLength](#maxlength)
    - [padRight](#padright)
    - [pascalCase](#pascalcase)
    - [plural](#plural)
    - [quote](#quote)
    - [singleLine](#singleline)
    - [singleQuote](#singlequote)
    - [singular](#singular)
    - [snakeCase](#snakecase)
    - [stringify](#stringify)
    - [strip](#strip)
    - [stripPrefix](#stripprefix)
    - [stripSuffix](#stripsuffix)
    - [titleCase](#titlecase)
    - [uniqueArray](#uniquearray)
    - [wordWrap](#wordwrap)
    - [wrap](#wrap)
    - [wrapIf](#wrapif)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Installation

# Synopsis

```ts

```

# Details

<!-- usage -->

<!-- commands -->

# API

<a name="readmemd"></a>

## Table of contents

### Namespaces

- [converters](#modulesconvertersmd)
- [filterFunctions](#modulesfilterfunctionsmd)

### Classes

- [PgGenerator](#classespggeneratormd)

### Interfaces

- [ClientOptions](#interfacesclientoptionsmd)
- [GeneratorOptions](#interfacesgeneratoroptionsmd)

## Type aliases

### Context

Ƭ **Context**: _object_

Context provided to render function.

#### Type declaration:

| Name | Type                   |
| :--- | :--------------------- |
| `c`  | _Record_<string, any\> |
| `o`  | Db \| DbObject         |

Defined in: [types/index.ts:53](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/types/index.ts#L53)

---

### Options

Ƭ **Options**: [_GeneratorOptions_](#interfacesgeneratoroptionsmd) & [_ClientOptions_](#interfacesclientoptionsmd)

Defined in: [types/index.ts:50](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/types/index.ts#L50)

## Functions

### generate

▸ **generate**(`generator`: _string_, `options?`: [_Options_](#options)): _Promise_<void\>

Executes the default sub-generator `app` from a generator.

#### Example

```typescript
generate("generator-from-npm", options);
generate(require.resolve("./local-generator"), options);
```

#### Parameters:

| Name        | Type                  | Description                                                                                                     |
| :---------- | :-------------------- | :-------------------------------------------------------------------------------------------------------------- |
| `generator` | _string_              | is the name or path of the generator. If it is a local path, use `require.resolve` or provide an absolute path. |
| `options?`  | [_Options_](#options) | are the options for the generator.                                                                              |

**Returns:** _Promise_<void\>

Defined in: [generate.ts:15](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/generate.ts#L15)

▸ **generate**(`generator`: _string_, `subGenerator?`: _string_, `options?`: [_Options_](#options)): _Promise_<void\>

Executes a sub-generator from a generator.

#### Example

```typescript
generate("generator-from-npm", "sub-generator");
generate(require.resolve("./local-generator"), "sub-generator", options);
```

#### Parameters:

| Name            | Type                  | Description                                                                                                     |
| :-------------- | :-------------------- | :-------------------------------------------------------------------------------------------------------------- |
| `generator`     | _string_              | is the name or path of the generator. If it is a local path, use `require.resolve` or provide an absolute path. |
| `subGenerator?` | _string_              | is the name of the generator.                                                                                   |
| `options?`      | [_Options_](#options) | are the new options added on top of curent options.                                                             |

**Returns:** _Promise_<void\>

Defined in: [generate.ts:27](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/generate.ts#L27)

# Classes

<a name="classespggeneratormd"></a>

[pg-generator](#readmemd) / PgGenerator

# Class: PgGenerator<O\>

Base abstract class for for pg-generator classes.

## Type parameters

| Name | Type                                                | Default                                             |
| :--- | :-------------------------------------------------- | :-------------------------------------------------- |
| `O`  | [_GeneratorOptions_](#interfacesgeneratoroptionsmd) | [_GeneratorOptions_](#interfacesgeneratoroptionsmd) |

## Constructors

### constructor

\+ **new PgGenerator**<O\>(`options`: O, `internalOptions`: InternalOptions): [_PgGenerator_](#classespggeneratormd)<O\>

Creates an instance of PgGenerator.

#### Type parameters:

| Name | Type                                                | Default                                             |
| :--- | :-------------------------------------------------- | :-------------------------------------------------- |
| `O`  | [_GeneratorOptions_](#interfacesgeneratoroptionsmd) | [_GeneratorOptions_](#interfacesgeneratoroptionsmd) |

#### Parameters:

| Name              | Type            | Description                                             |
| :---------------- | :-------------- | :------------------------------------------------------ |
| `options`         | O               | are parameters for several options.                     |
| `internalOptions` | InternalOptions | are added by `pg-generator` functions and not for user. |

**Returns:** [_PgGenerator_](#classespggeneratormd)<O\>

Defined in: [pg-generator.ts:24](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/pg-generator.ts#L24)

## Methods

### generate

▸ **generate**(): _Promise_<void\>

Renders all templates in `[rootDir]/templates` directory with the render function using related context data,
and writes generated contents to the files in output directory. If render function returns `undefined`
for a template/database object pair no file is not written for that pair.

Template file names may contain variables and basic filter functions to change names of generated files.

Additionally copies all files in `[rootDir]/files` to the output directory.

**Returns:** _Promise_<void\>

Defined in: [pg-generator.ts:51](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/pg-generator.ts#L51)

# Interfaces

<a name="interfacesclientoptionsmd"></a>

[pg-generator](#readmemd) / ClientOptions

# Interface: ClientOptions

## Hierarchy

- _PgStructureOptions_

  ↳ **ClientOptions**

## Properties

### client

• `Optional` **client**: _undefined_ \| _string_ \| _Client_ \| ClientConfig

Either a [node-postgres client](https://node-postgres.com/api/client) or a configuration object or a connection string to create a [node-postgres client](https://node-postgres.com/api/client).

Defined in: [types/index.ts:20](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/types/index.ts#L20)

---

### connectionString

• `Optional` **connectionString**: _undefined_ \| _string_

Connection string to connect to the database e.g. postgres://user:password@host:5432/database

Defined in: [types/index.ts:35](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/types/index.ts#L35)

---

### database

• `Optional` **database**: _undefined_ \| _string_

Database to connect. Default from environment var: PGDATABASE || DB_DATABASE

Defined in: [types/index.ts:31](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/types/index.ts#L31)

---

### host

• `Optional` **host**: _undefined_ \| _string_

Database host. Default from environment var: PGHOST || DB_HOST

Defined in: [types/index.ts:29](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/types/index.ts#L29)

---

### password

• `Optional` **password**: _undefined_ \| _string_

Database password. Default from environment var: PGPASSWORD || DB_PASSWORD

Defined in: [types/index.ts:27](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/types/index.ts#L27)

---

### port

• `Optional` **port**: _undefined_ \| _string_

Database port. Default from environment var: PGPORT || DB_PORT

Defined in: [types/index.ts:33](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/types/index.ts#L33)

---

### ssl

• `Optional` **ssl**: _any_

Passed directly to node.TLSSocket, supports all tls.connect options

Defined in: [types/index.ts:37](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/types/index.ts#L37)

---

### user

• `Optional` **user**: _undefined_ \| _string_

Database username. Default from environment var: PGUSER || USER || DB_USER

Defined in: [types/index.ts:25](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/types/index.ts#L25)

<a name="interfacesgeneratoroptionsmd"></a>

[pg-generator](#readmemd) / GeneratorOptions

# Interface: GeneratorOptions

Options for generation and reverse engineering process. Options extends [pg-structure options](https://www.pg-structure.com/nav.02.api/interfaces/options)

## Properties

### clear

• `Optional` **clear**: _undefined_ \| _boolean_

Whether to clear the destination directory before creating files.

Defined in: [types/index.ts:7](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/types/index.ts#L7)

---

### context

• `Optional` **context**: _undefined_ \| _Record_<string, any\>

Extra context data. This data is merged with and overridden by data from context file.

Defined in: [types/index.ts:13](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/types/index.ts#L13)

---

### contextFile

• `Optional` **contextFile**: _undefined_ \| _string_

Path to a JSON or JS file providing extra context for templates.

Defined in: [types/index.ts:11](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/types/index.ts#L11)

---

### log

• `Optional` **log**: _undefined_ \| _boolean_

Whether to log output to console.

Defined in: [types/index.ts:15](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/types/index.ts#L15)

---

### outDir

• `Optional` **outDir**: _undefined_ \| _string_

Path of the output directory.

Defined in: [types/index.ts:9](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/types/index.ts#L9)

# Modules

<a name="modulesconvertersmd"></a>

[pg-generator](#readmemd) / converters

# Namespace: converters

## Functions

### mermaidToSVG

▸ **mermaidToSVG**(`data`: _string_, `options?`: { `link`: }): _string_

#### Parameters:

| Name           | Type     |
| :------------- | :------- |
| `data`         | _string_ |
| `options`      | _object_ |
| `options.link` | -        |

**Returns:** _string_

Defined in: [converters/mermaid-to-svg.ts:8](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/converters/mermaid-to-svg.ts#L8)

<a name="modulesfilterfunctionsmd"></a>

[pg-generator](#readmemd) / filterFunctions

# Namespace: filterFunctions

## Functions

### camelCase

▸ **camelCase**(`input?`: _string_): _string_

Converts the given input to the camel case.

#### Example

```typescript
camelCase("user-name"); // userName
```

#### Parameters:

| Name    | Type     | Default value | Description                     |
| :------ | :------- | :------------ | :------------------------------ |
| `input` | _string_ | ""            | is the input string to convert. |

**Returns:** _string_

string as camel case.

Defined in: [utils/filter-functions.ts:49](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/utils/filter-functions.ts#L49)

---

### classCase

▸ **classCase**(`input?`: _string_): _string_

Converts the given input to the class name.

#### Example

```typescript
classCase("user-name"); // UserName
```

#### Parameters:

| Name    | Type     | Default value | Description                     |
| :------ | :------- | :------------ | :------------------------------ |
| `input` | _string_ | ""            | is the input string to convert. |

**Returns:** _string_

string as class case.

Defined in: [utils/filter-functions.ts:75](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/utils/filter-functions.ts#L75)

---

### clearDefault

▸ **clearDefault**(`input?`: _string_): _string_ \| _undefined_

Clears the default value of a database object.

- Converts two quotes `''` to single quote `'`
- Removes quotes at the start and end of string.
- Escapes result according to JSON standards.

#### Example

```typescript
clearDefaultValue("'No ''value'' given'"); // "No value 'given'"
```

#### Parameters:

| Name     | Type     | Description                           |
| :------- | :------- | :------------------------------------ |
| `input?` | _string_ | is the default for a database object. |

**Returns:** _string_ \| _undefined_

default value to be used in a template.

Defined in: [utils/filter-functions.ts:27](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/utils/filter-functions.ts#L27)

---

### concat

▸ **concat**(`input`: _Record_<string, any\>, ...`objects`: _Record_<string, any\>[]): _Record_<string, any\>

#### Parameters:

| Name         | Type                     |
| :----------- | :----------------------- |
| `input`      | _Record_<string, any\>   |
| `...objects` | _Record_<string, any\>[] |

**Returns:** _Record_<string, any\>

Defined in: [utils/filter-functions.ts:477](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/utils/filter-functions.ts#L477)

---

### dashCase

▸ **dashCase**(`input?`: _string_): _string_

Converts the given input to the dash case.

#### Example

```typescript
dashCase("User Name"); // user-name
```

#### Parameters:

| Name    | Type     | Default value | Description                     |
| :------ | :------- | :------------ | :------------------------------ |
| `input` | _string_ | ""            | is the input string to convert. |

**Returns:** _string_

string as dash case.

Defined in: [utils/filter-functions.ts:101](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/utils/filter-functions.ts#L101)

---

### dboClassName

▸ **dboClassName**(`object?`: DbObject, `schema?`: _boolean_): _string_

Returns given the given database object name as a class name.

#### Parameters:

| Name      | Type      | Default value | Description                                    |
| :-------- | :-------- | :------------ | :--------------------------------------------- |
| `object?` | DbObject  | -             | is the object to get the name as a class name. |
| `schema`  | _boolean_ | false         | is whether to include schema name.             |

**Returns:** _string_

Defined in: [utils/filter-functions.ts:493](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/utils/filter-functions.ts#L493)

---

### dboColumnTypeModifier

▸ **dboColumnTypeModifier**(`column?`: Column): _string_

Returns column length, precision and scale ready to be used in templates.

#### Example

```typescript
columnTypeModifier(price); // (10,4)
columnTypeModifier(name); // (20)
```

#### Parameters:

| Name      | Type   | Description                   |
| :-------- | :----- | :---------------------------- |
| `column?` | Column | is the column to get details. |

**Returns:** _string_

modifier string.

Defined in: [utils/filter-functions.ts:508](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/utils/filter-functions.ts#L508)

---

### doubleQuote

▸ **doubleQuote**(`input?`: _string_): _string_

Wraps the given string with double quotes.

#### Example

```typescript
plural("Some "example" text"); // "some \"example\" text"
```

#### Parameters:

| Name     | Type     | Description                                     |
| :------- | :------- | :---------------------------------------------- |
| `input?` | _string_ | is the input string to wrap with double quotes. |

**Returns:** _string_

string with quotes.

Defined in: [utils/filter-functions.ts:207](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/utils/filter-functions.ts#L207)

---

### fill

▸ **fill**(`input?`: _string_, `length?`: _number_, `char?`: _string_): _string_

Completes given input's length using with given character (by default space). It may be used to align
strings in JSDoc etc.

#### Example

```typescript
completeWithChar("member", "10"); // "member    "
completeWithChar("member", "10", "-"); // "member----"
```

#### Parameters:

| Name     | Type     | Default value | Description                              |
| :------- | :------- | :------------ | :--------------------------------------- |
| `input`  | _string_ | ""            | is the input to complete length of.      |
| `length` | _number_ | 20            | is the length of the finel string.       |
| `char`   | _string_ | " "           | is the character to be used for filling. |

**Returns:** _string_

Defined in: [utils/filter-functions.ts:294](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/utils/filter-functions.ts#L294)

---

### human

▸ **human**(`input?`: _string_, `lowFirstLetter?`: _boolean_): _string_

Converts text to natural language.

#### Example

```typescript
human("message_properties"); // "Message properties"
human("message_properties", true); // "message properties"
```

#### Parameters:

| Name              | Type      | Default value | Description                                  |
| :---------------- | :-------- | :------------ | :------------------------------------------- |
| `input`           | _string_  | ""            | is the input string to convert.              |
| `lowFirstLetter?` | _boolean_ | -             | is whther to use small letter in first word. |

**Returns:** _string_

string in human readable form.

Defined in: [utils/filter-functions.ts:155](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/utils/filter-functions.ts#L155)

---

### lcFirst

▸ **lcFirst**(`input?`: _string_): _string_

Converts the given input's first letter to the lower case.

#### Example

```typescript
plural("User_name"); // User_name
```

#### Parameters:

| Name    | Type     | Default value | Description                     |
| :------ | :------- | :------------ | :------------------------------ |
| `input` | _string_ | ""            | is the input string to convert. |

**Returns:** _string_

string with lower first case.

Defined in: [utils/filter-functions.ts:168](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/utils/filter-functions.ts#L168)

---

### linePrefix

▸ **linePrefix**(`input?`: _string_, `prefix`: _string_): _string_

Adds given prefix each of the lines of given text.

#### Example

```typescript
linePrefix(
  `
Text line 1
Text line 2
`,
  "// "
);

// Text line 1
// Text line 2
```

**`returs`** the result string.

#### Parameters:

| Name     | Type     | Default value | Description                             |
| :------- | :------- | :------------ | :-------------------------------------- |
| `input`  | _string_ | ""            | is the input string.                    |
| `prefix` | _string_ | -             | is the prefix to add each of the lines. |

**Returns:** _string_

Defined in: [utils/filter-functions.ts:357](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/utils/filter-functions.ts#L357)

---

### listAttribute

▸ **listAttribute**<T\>(`objects`: T[], `attribute?`: keyof T, `options?`: { `join?`: _string_ ; `quote?`: _single_ \| _double_ \| _json_ ; `wrap?`: _string_ }): _string_

Returns an attribute of each objects as a CSV (comma separated values)

#### Example

```typescript
const objects = [{ name: "a" }, { name: "b" }, { name: "c" }];

listAttribute(objects, "name"); // a, b, c
listAttribute(objects, "name", { quote: "json" }); // "a", "b", "c"
listAttribute(objects, "name", { quote: "single" }); // 'a', 'b', 'c'
listAttribute(objects, "name", { quote: "json", wrap: "[]" }); // ["a", "b", "c"]
listAttribute(objects, "name", { quote: "json", wrap: "[]" }); // "a"
```

#### Type parameters:

| Name | Type      |
| :--- | :-------- |
| `T`  | _unknown_ |

#### Parameters:

| Name             | Type                           | Description                                                     |
| :--------------- | :----------------------------- | :-------------------------------------------------------------- |
| `objects`        | T[]                            | are the array of objects to get attribute of.                   |
| `attribute`      | keyof T                        | is the attribute to get for each object.                        |
| `options`        | _object_                       | are the options.                                                |
| `options.join?`  | _string_                       | is the character to join list.                                  |
| `options.quote?` | _single_ \| _double_ \| _json_ | is whether to add quotes around attributes.                     |
| `options.wrap?`  | _string_                       | is the characters to wrap the list if length is greater than 1. |

**Returns:** _string_

the list as a string.

Defined in: [utils/filter-functions.ts:449](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/utils/filter-functions.ts#L449)

---

### maxLength

▸ **maxLength**(`input?`: _string_, `length?`: _number_): _string_

Cuts the text after given number of characters.

#### Example

```typescript
maxLength("some example text", 7); // "some ex...";
```

#### Parameters:

| Name     | Type     | Default value | Description                    |
| :------- | :------- | :------------ | :----------------------------- |
| `input`  | _string_ | ""            | is the text to shorten.        |
| `length` | _number_ | 50            | is the maximum length allowed. |

**Returns:** _string_

cut text

Defined in: [utils/filter-functions.ts:278](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/utils/filter-functions.ts#L278)

---

### padRight

▸ **padRight**(`input`: _string_ \| _undefined_, `totalLength`: _number_, `paddingString?`: _string_): _string_

Pads given string's end with given padding string to complete its length to count.

#### Parameters:

| Name            | Type                    | Default value | Description                               |
| :-------------- | :---------------------- | :------------ | :---------------------------------------- |
| `input`         | _string_ \| _undefined_ | -             | is the input string to convert.           |
| `totalLength`   | _number_                | -             | is the total length of the result string. |
| `paddingString` | _string_                | " "           | is the string to pad with.                |

**Returns:** _string_

the string padded with padding string.

Defined in: [utils/filter-functions.ts:261](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/utils/filter-functions.ts#L261)

---

### pascalCase

▸ **pascalCase**(`input?`: _string_): _string_

Converts the given input to the pascal case.

#### Example

```typescript
pascalCase("user-name"); // UserName
```

#### Parameters:

| Name    | Type     | Default value | Description                     |
| :------ | :------- | :------------ | :------------------------------ |
| `input` | _string_ | ""            | is the input string to convert. |

**Returns:** _string_

string as pascal case.

Defined in: [utils/filter-functions.ts:62](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/utils/filter-functions.ts#L62)

---

### plural

▸ **plural**(`input?`: _string_): _string_

Converts the given input to the plural form.

#### Example

```typescript
plural("user_name"); // user_names
```

#### Parameters:

| Name    | Type     | Default value | Description                     |
| :------ | :------- | :------------ | :------------------------------ |
| `input` | _string_ | ""            | is the input string to convert. |

**Returns:** _string_

string in plural form.

Defined in: [utils/filter-functions.ts:140](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/utils/filter-functions.ts#L140)

---

### quote

▸ **quote**(`input?`: _string_): _string_

Wraps the given string with quotes.

#### Example

```typescript
plural("user_name"); // "user_name"
```

#### Parameters:

| Name     | Type     | Description                              |
| :------- | :------- | :--------------------------------------- |
| `input?` | _string_ | is the input string to wrap with quotes. |

**Returns:** _string_

string with quotes.

Defined in: [utils/filter-functions.ts:181](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/utils/filter-functions.ts#L181)

---

### singleLine

▸ **singleLine**(`input?`: _string_): _string_

If given data is a multi line string replaces new lines with escape characters. May be used to prevent JS multi line errors.

#### Parameters:

| Name    | Type     | Default value | Description              |
| :------ | :------- | :------------ | :----------------------- |
| `input` | _string_ | ""            | is the input to convert. |

**Returns:** _string_

the string with escape characters.

Defined in: [utils/filter-functions.ts:415](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/utils/filter-functions.ts#L415)

---

### singleQuote

▸ **singleQuote**(`input?`: _string_): _string_

Wraps the given string with single quotes.

#### Example

```typescript
plural("Some 'example' text"); // 'some \'example\' text'
```

#### Parameters:

| Name     | Type     | Description                                     |
| :------- | :------- | :---------------------------------------------- |
| `input?` | _string_ | is the input string to wrap with single quotes. |

**Returns:** _string_

string with quotes.

Defined in: [utils/filter-functions.ts:194](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/utils/filter-functions.ts#L194)

---

### singular

▸ **singular**(`input?`: _string_): _string_

Converts the given input to the singular form.

#### Example

```typescript
singular("user_names"); // user_name
```

#### Parameters:

| Name    | Type     | Default value | Description                     |
| :------ | :------- | :------------ | :------------------------------ |
| `input` | _string_ | ""            | is the input string to convert. |

**Returns:** _string_

string in singular form.

Defined in: [utils/filter-functions.ts:127](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/utils/filter-functions.ts#L127)

---

### snakeCase

▸ **snakeCase**(`input?`: _string_): _string_

Converts the given input to the snake case.

#### Example

```typescript
snakeCase("userName"); // user_name
```

#### Parameters:

| Name    | Type     | Default value | Description                     |
| :------ | :------- | :------------ | :------------------------------ |
| `input` | _string_ | ""            | is the input string to convert. |

**Returns:** _string_

string as snake case.

Defined in: [utils/filter-functions.ts:88](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/utils/filter-functions.ts#L88)

---

### stringify

▸ **stringify**(`input`: _any_, `options?`: { `indent?`: _number_ ; `nullToUndef?`: _boolean_ ; `raw?`: _boolean_ }): _string_

If given data is object or array, converts it to string.

1. If it has `toString` method uses it. If it returns [object Object] tries other steps.
2. Uses `util.inspect()`;

#### Parameters:

| Name                   | Type      | Description                                     |
| :--------------------- | :-------- | :---------------------------------------------- |
| `input`                | _any_     | is the input to convert.                        |
| `options`              | _object_  | are the options.                                |
| `options.indent?`      | _number_  | is size of the indentation of each level.       |
| `options.nullToUndef?` | _boolean_ | if true, converts all null values to undefined. |
| `options.raw?`         | _boolean_ | if true, does not add quotes around values.     |

**Returns:** _string_

converted value.

Defined in: [utils/filter-functions.ts:392](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/utils/filter-functions.ts#L392)

---

### strip

▸ **strip**(`input`: _string_ \| _undefined_, ...`removeList`: (_string_ \| { `name`: _string_ })[]): _string_

Vairadic function which strips all of the given strings or database object's names from the source string.

#### Parameters:

| Name            | Type                                 | Description                                             |
| :-------------- | :----------------------------------- | :------------------------------------------------------ |
| `input`         | _string_ \| _undefined_              | is the input string to convert.                         |
| `...removeList` | (_string_ \| { `name`: _string_ })[] | is the list of strings or objects to remove from input. |

**Returns:** _string_

converted string.

Defined in: [utils/filter-functions.ts:246](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/utils/filter-functions.ts#L246)

---

### stripPrefix

▸ **stripPrefix**(`input`: _string_ \| _undefined_, ...`removeList`: (_string_ \| { `name`: _string_ })[]): _string_

Vairadic function which strips all of the given strings or database object's names from the start of the source string.

#### Parameters:

| Name            | Type                                 | Description                                             |
| :-------------- | :----------------------------------- | :------------------------------------------------------ |
| `input`         | _string_ \| _undefined_              | is the input string to convert.                         |
| `...removeList` | (_string_ \| { `name`: _string_ })[] | is the list of strings or objects to remove from input. |

**Returns:** _string_

converted string.

Defined in: [utils/filter-functions.ts:218](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/utils/filter-functions.ts#L218)

---

### stripSuffix

▸ **stripSuffix**(`input`: _string_ \| _undefined_, ...`removeList`: (_string_ \| { `name`: _string_ })[]): _string_

Vairadic function which strips all of the given strings or database object's names from the end of the source string.

#### Parameters:

| Name            | Type                                 | Description                                             |
| :-------------- | :----------------------------------- | :------------------------------------------------------ |
| `input`         | _string_ \| _undefined_              | is the input string to convert.                         |
| `...removeList` | (_string_ \| { `name`: _string_ })[] | is the list of strings or objects to remove from input. |

**Returns:** _string_

converted string.

Defined in: [utils/filter-functions.ts:232](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/utils/filter-functions.ts#L232)

---

### titleCase

▸ **titleCase**(`input?`: _string_): _string_

Converts the given input to the title case.

#### Example

```typescript
titleCase("user_name"); // User Name
```

#### Parameters:

| Name    | Type     | Default value | Description                     |
| :------ | :------- | :------------ | :------------------------------ |
| `input` | _string_ | ""            | is the input string to convert. |

**Returns:** _string_

string as title case.

Defined in: [utils/filter-functions.ts:114](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/utils/filter-functions.ts#L114)

---

### uniqueArray

▸ **uniqueArray**<T\>(`input?`: T[]): T[]

Returns given array with unique elements by eliminating duplicate values.

#### Type parameters:

| Name | Type      |
| :--- | :-------- |
| `T`  | _unknown_ |

#### Parameters:

| Name     | Type | Description                                      |
| :------- | :--- | :----------------------------------------------- |
| `input?` | T[]  | is the input array to eliminate duplicates from. |

**Returns:** T[]

the array with unique values.

Defined in: [utils/filter-functions.ts:425](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/utils/filter-functions.ts#L425)

---

### wordWrap

▸ **wordWrap**(`input?`: _string_, `startOrStop?`: _number_, `stop?`: _number_): _string_

Word wraps given text.

#### Example

```typescript
wordWrap("The quick fox", 10); // "The quick\nfox"
wordWrap("The quick fox", 2, 10); // "  The quick\n  fox"
```

#### Parameters:

| Name          | Type     | Default value | Description                                                                                   |
| :------------ | :------- | :------------ | :-------------------------------------------------------------------------------------------- |
| `input?`      | _string_ | -             | is the text to word wrap.                                                                     |
| `startOrStop` | _number_ | 80            | is the start or the stop position of each line. (The stop position if this is single option.) |
| `stop?`       | _number_ | -             | is the stop position of each line.                                                            |

**Returns:** _string_

word wrapped text.

Defined in: [utils/filter-functions.ts:472](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/utils/filter-functions.ts#L472)

---

### wrap

▸ **wrap**(`input?`: _string_, `wrapper?`: _string_): _string_

Wraps given text with start and end characters. By default it wraps with curly braces.

#### Example

```typescript
wrap("hello"); // "{hello}"
wrap("hello", "~"); // "~hello~"
wrap("hello", "[]"); // "[hello]"
```

#### Parameters:

| Name      | Type     | Default value | Description          |
| :-------- | :------- | :------------ | :------------------- |
| `input?`  | _string_ | -             | is the text to warp. |
| `wrapper` | _string_ | "{}"          | -                    |

**Returns:** _string_

wrapped text.

Defined in: [utils/filter-functions.ts:312](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/utils/filter-functions.ts#L312)

---

### wrapIf

▸ **wrapIf**(`input`: _string_ \| _undefined_, `condition`: _any_, `wrapper?`: _string_): _string_

Wraps given text with start and end characters if given condition is truthy.
By default it wraps with curly braces.

#### Example

```typescript
wrapIf("hello", "x"); // "{hello}"
wrapIf("hello", true); // "{hello}"
wrapIf("hello", false); // "hello"
wrapIf("hello", true, "~"); // "~hello~"
wrapIf("hello", true, "[]"); // "[hello]"
```

#### Parameters:

| Name        | Type                    | Default value | Description                        |
| :---------- | :---------------------- | :------------ | :--------------------------------- |
| `input`     | _string_ \| _undefined_ | -             | is the text to warp.               |
| `condition` | _any_                   | -             | is the condition or value to test. |
| `wrapper`   | _string_                | "{}"          | -                                  |

**Returns:** _string_

wrapped text.

Defined in: [utils/filter-functions.ts:336](https://github.com/ozum/pg-generator/blob/4ae6c3c/src/utils/filter-functions.ts#L336)
