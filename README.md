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
- [Interface: GeneratorOptions](#interface-generatoroptions)
  - [Properties](#properties)
    - [clear](#clear)
    - [context](#context)
    - [contextFile](#contextfile)
    - [log](#log)
    - [outDir](#outdir)
- [Modules](#modules)
- [Namespace: filterFunctions](#namespace-filterfunctions)
  - [Functions](#functions-1)
    - [camelCase](#camelcase)
    - [classCase](#classcase)
    - [clearDefault](#cleardefault)
    - [dashCase](#dashcase)
    - [dboClassName](#dboclassname)
    - [dboColumnTypeModifier](#dbocolumntypemodifier)
    - [lcFirst](#lcfirst)
    - [makeJsDoc](#makejsdoc)
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
    - [uniqueArray](#uniquearray)

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

- [filterFunctions](#modulesfilterfunctionsmd)

### Classes

- [PgGenerator](#classespggeneratormd)

### Interfaces

- [GeneratorOptions](#interfacesgeneratoroptionsmd)

## Type aliases

### Context

Ƭ **Context**: _object_

Context provided to render function.

#### Type declaration:

| Name | Type                   |
| :--- | :--------------------- |
| `o`  | Db \| DbObject         |
| `x`  | _Record_<string, any\> |

Defined in: [types/index.ts:53](https://github.com/ozum/pg-generator/blob/e8d9080/src/types/index.ts#L53)

---

### Options

Ƭ **Options**: [_GeneratorOptions_](#interfacesgeneratoroptionsmd) & ClientOptions

Defined in: [types/index.ts:50](https://github.com/ozum/pg-generator/blob/e8d9080/src/types/index.ts#L50)

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

Defined in: [generate.ts:15](https://github.com/ozum/pg-generator/blob/e8d9080/src/generate.ts#L15)

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

Defined in: [generate.ts:27](https://github.com/ozum/pg-generator/blob/e8d9080/src/generate.ts#L27)

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

Defined in: [pg-generator.ts:23](https://github.com/ozum/pg-generator/blob/e8d9080/src/pg-generator.ts#L23)

## Methods

### generate

▸ **generate**(): _Promise_<void\>

Renders all templates in `[rootDir]/templates` directory with the render function using related context data,
and writes generated contents to the files in output directory. If render function returns `undefined`
for a template/database object pair no file is not written for that pair.

Template file names may contain variables and basic filter functions to change names of generated files.

Additionally copies all files in `[rootDir]/files` to the output directory.

**Returns:** _Promise_<void\>

Defined in: [pg-generator.ts:47](https://github.com/ozum/pg-generator/blob/e8d9080/src/pg-generator.ts#L47)

# Interfaces

<a name="interfacesgeneratoroptionsmd"></a>

[pg-generator](#readmemd) / GeneratorOptions

# Interface: GeneratorOptions

Options for generation and reverse engineering process. Options extends [pg-structure options](https://www.pg-structure.com/nav.02.api/interfaces/options)

## Properties

### clear

• `Optional` **clear**: _undefined_ \| _boolean_

Whether to clear the destination directory before creating files.

Defined in: [types/index.ts:7](https://github.com/ozum/pg-generator/blob/e8d9080/src/types/index.ts#L7)

---

### context

• `Optional` **context**: _undefined_ \| _Record_<string, any\>

Extra context data. This data is merged with and overridden by data from context file.

Defined in: [types/index.ts:13](https://github.com/ozum/pg-generator/blob/e8d9080/src/types/index.ts#L13)

---

### contextFile

• `Optional` **contextFile**: _undefined_ \| _string_

Path to a JSON or JS file providing extra context for templates.

Defined in: [types/index.ts:11](https://github.com/ozum/pg-generator/blob/e8d9080/src/types/index.ts#L11)

---

### log

• `Optional` **log**: _undefined_ \| _boolean_

Whether to log output to console.

Defined in: [types/index.ts:15](https://github.com/ozum/pg-generator/blob/e8d9080/src/types/index.ts#L15)

---

### outDir

• `Optional` **outDir**: _undefined_ \| _string_

Path of the output directory.

Defined in: [types/index.ts:9](https://github.com/ozum/pg-generator/blob/e8d9080/src/types/index.ts#L9)

# Modules

<a name="modulesfilterfunctionsmd"></a>

[pg-generator](#readmemd) / filterFunctions

# Namespace: filterFunctions

## Functions

### camelCase

▸ **camelCase**(`input`: _string_): _string_

Converts the given input to the camel case.

#### Example

```typescript
camelCase("user-name"); // userName
```

#### Parameters:

| Name    | Type     | Description                     |
| :------ | :------- | :------------------------------ |
| `input` | _string_ | is the input string to convert. |

**Returns:** _string_

string as camel case.

Defined in: [utils/filter-functions.ts:48](https://github.com/ozum/pg-generator/blob/e8d9080/src/utils/filter-functions.ts#L48)

---

### classCase

▸ **classCase**(`input`: _string_): _string_

Converts the given input to the class name.

#### Example

```typescript
classCase("user-name"); // UserName
```

#### Parameters:

| Name    | Type     | Description                     |
| :------ | :------- | :------------------------------ |
| `input` | _string_ | is the input string to convert. |

**Returns:** _string_

string as class case.

Defined in: [utils/filter-functions.ts:74](https://github.com/ozum/pg-generator/blob/e8d9080/src/utils/filter-functions.ts#L74)

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

Defined in: [utils/filter-functions.ts:26](https://github.com/ozum/pg-generator/blob/e8d9080/src/utils/filter-functions.ts#L26)

---

### dashCase

▸ **dashCase**(`input`: _string_): _string_

Converts the given input to the dash case.

#### Example

```typescript
dashCase("User Name"); // user-name
```

#### Parameters:

| Name    | Type     | Description                     |
| :------ | :------- | :------------------------------ |
| `input` | _string_ | is the input string to convert. |

**Returns:** _string_

string as dash case.

Defined in: [utils/filter-functions.ts:100](https://github.com/ozum/pg-generator/blob/e8d9080/src/utils/filter-functions.ts#L100)

---

### dboClassName

▸ **dboClassName**(`object`: DbObject, `schema?`: _boolean_): _string_

Returns given the given database object name as a class name.

#### Parameters:

| Name     | Type      | Default value | Description                                    |
| :------- | :-------- | :------------ | :--------------------------------------------- |
| `object` | DbObject  | -             | is the object to get the name as a class name. |
| `schema` | _boolean_ | false         | is whether to include schema name.             |

**Returns:** _string_

Defined in: [utils/filter-functions.ts:319](https://github.com/ozum/pg-generator/blob/e8d9080/src/utils/filter-functions.ts#L319)

---

### dboColumnTypeModifier

▸ **dboColumnTypeModifier**(`column`: Column): _string_

Returns column length, precision and scale ready to be used in templates.

#### Example

```typescript
columnTypeModifier(price); // (10,4)
columnTypeModifier(name); // (20)
```

#### Parameters:

| Name     | Type   | Description                   |
| :------- | :----- | :---------------------------- |
| `column` | Column | is the column to get details. |

**Returns:** _string_

modifier string.

Defined in: [utils/filter-functions.ts:333](https://github.com/ozum/pg-generator/blob/e8d9080/src/utils/filter-functions.ts#L333)

---

### lcFirst

▸ **lcFirst**(`input`: _string_): _string_

Converts the given input's first letter to the lower case.

#### Example

```typescript
plural("User_name"); // User_name
```

#### Parameters:

| Name    | Type     | Description                     |
| :------ | :------- | :------------------------------ |
| `input` | _string_ | is the input string to convert. |

**Returns:** _string_

string with lower first case.

Defined in: [utils/filter-functions.ts:139](https://github.com/ozum/pg-generator/blob/e8d9080/src/utils/filter-functions.ts#L139)

---

### makeJsDoc

▸ **makeJsDoc**(`input?`: _string_): _string_

Converts given string to JSOC lines by adding "\*" at the start of each line.

#### Example

```typescript
makeJsDoc(`
Text line 1
Text line 2
`);

// * Text line 1
// * Text line 1
```

**`returs`** the result string.

#### Parameters:

| Name    | Type     | Default value | Description                     |
| :------ | :------- | :------------ | :------------------------------ |
| `input` | _string_ | ""            | is the input string to convert. |

**Returns:** _string_

Defined in: [utils/filter-functions.ts:237](https://github.com/ozum/pg-generator/blob/e8d9080/src/utils/filter-functions.ts#L237)

---

### padRight

▸ **padRight**(`input`: _string_, `totalLength`: _number_, `paddingString?`: _string_): _string_

Pads given string's end with given padding string to complete its length to count.

#### Parameters:

| Name            | Type     | Default value | Description                               |
| :-------------- | :------- | :------------ | :---------------------------------------- |
| `input`         | _string_ | -             | is the input string to convert.           |
| `totalLength`   | _number_ | -             | is the total length of the result string. |
| `paddingString` | _string_ | " "           | is the string to pad with.                |

**Returns:** _string_

the string padded with padding string.

Defined in: [utils/filter-functions.ts:216](https://github.com/ozum/pg-generator/blob/e8d9080/src/utils/filter-functions.ts#L216)

---

### pascalCase

▸ **pascalCase**(`input`: _string_): _string_

Converts the given input to the pascal case.

#### Example

```typescript
pascalCase("user-name"); // UserName
```

#### Parameters:

| Name    | Type     | Description                     |
| :------ | :------- | :------------------------------ |
| `input` | _string_ | is the input string to convert. |

**Returns:** _string_

string as pascal case.

Defined in: [utils/filter-functions.ts:61](https://github.com/ozum/pg-generator/blob/e8d9080/src/utils/filter-functions.ts#L61)

---

### plural

▸ **plural**(`input`: _string_): _string_

Converts the given input to the plural form.

#### Example

```typescript
plural("user_name"); // user_names
```

#### Parameters:

| Name    | Type     | Description                     |
| :------ | :------- | :------------------------------ |
| `input` | _string_ | is the input string to convert. |

**Returns:** _string_

string in plural form.

Defined in: [utils/filter-functions.ts:126](https://github.com/ozum/pg-generator/blob/e8d9080/src/utils/filter-functions.ts#L126)

---

### quote

▸ **quote**(`input`: _string_): _string_

Wraps the given string with quotes.

#### Example

```typescript
plural("user_name"); // "user_name"
```

#### Parameters:

| Name    | Type     | Description                              |
| :------ | :------- | :--------------------------------------- |
| `input` | _string_ | is the input string to wrap with quotes. |

**Returns:** _string_

string with quotes.

Defined in: [utils/filter-functions.ts:152](https://github.com/ozum/pg-generator/blob/e8d9080/src/utils/filter-functions.ts#L152)

---

### singleLine

▸ **singleLine**(`input`: _string_): _string_

If given data is a multi line string replcaes new lines with escape characters. May be used to prevent JS multi line errors.

#### Parameters:

| Name    | Type     | Description              |
| :------ | :------- | :----------------------- |
| `input` | _string_ | is the input to convert. |

**Returns:** _string_

the string with escape characters.

Defined in: [utils/filter-functions.ts:293](https://github.com/ozum/pg-generator/blob/e8d9080/src/utils/filter-functions.ts#L293)

---

### singleQuote

▸ **singleQuote**(`input`: _string_): _string_

Wraps the given string with single quotes.

#### Example

```typescript
plural("Some 'example' text"); // 'some \'example\' text'
```

#### Parameters:

| Name    | Type     | Description                              |
| :------ | :------- | :--------------------------------------- |
| `input` | _string_ | is the input string to wrap with quotes. |

**Returns:** _string_

string with quotes.

Defined in: [utils/filter-functions.ts:165](https://github.com/ozum/pg-generator/blob/e8d9080/src/utils/filter-functions.ts#L165)

---

### singular

▸ **singular**(`input`: _string_): _string_

Converts the given input to the singular form.

#### Example

```typescript
singular("user_names"); // user_name
```

#### Parameters:

| Name    | Type     | Description                     |
| :------ | :------- | :------------------------------ |
| `input` | _string_ | is the input string to convert. |

**Returns:** _string_

string in singular form.

Defined in: [utils/filter-functions.ts:113](https://github.com/ozum/pg-generator/blob/e8d9080/src/utils/filter-functions.ts#L113)

---

### snakeCase

▸ **snakeCase**(`input`: _string_): _string_

Converts the given input to the snake case.

#### Example

```typescript
snakeCase("userName"); // user_name
```

#### Parameters:

| Name    | Type     | Description                     |
| :------ | :------- | :------------------------------ |
| `input` | _string_ | is the input string to convert. |

**Returns:** _string_

string as snake case.

Defined in: [utils/filter-functions.ts:87](https://github.com/ozum/pg-generator/blob/e8d9080/src/utils/filter-functions.ts#L87)

---

### stringify

▸ **stringify**(`input`: _any_, `options?`: { `nullToUndef?`: _boolean_ ; `raw?`: _boolean_ }): _string_

If given data is object or array, converts it to string.

1. If it has `toString` method uses it. If it returns [object Object] tries other steps.
2. Uses `util.inspect()`;

#### Parameters:

| Name                   | Type      | Description              |
| :--------------------- | :-------- | :----------------------- |
| `input`                | _any_     | is the input to convert. |
| `options`              | _object_  | -                        |
| `options.nullToUndef?` | _boolean_ | -                        |
| `options.raw?`         | _boolean_ | -                        |

**Returns:** _string_

converted value.

Defined in: [utils/filter-functions.ts:270](https://github.com/ozum/pg-generator/blob/e8d9080/src/utils/filter-functions.ts#L270)

---

### strip

▸ **strip**(`input`: _string_, ...`removeList`: (_string_ \| { `name`: _string_ })[]): _string_

Vairadic function which strips all of the given strings or database object's names from the source string.

#### Parameters:

| Name            | Type                                 | Description                                             |
| :-------------- | :----------------------------------- | :------------------------------------------------------ |
| `input`         | _string_                             | is the input string to convert.                         |
| `...removeList` | (_string_ \| { `name`: _string_ })[] | is the list of strings or objects to remove from input. |

**Returns:** _string_

converted string.

Defined in: [utils/filter-functions.ts:202](https://github.com/ozum/pg-generator/blob/e8d9080/src/utils/filter-functions.ts#L202)

---

### stripPrefix

▸ **stripPrefix**(`input`: _string_, ...`removeList`: (_string_ \| { `name`: _string_ })[]): _string_

Vairadic function which strips all of the given strings or database object's names from the start of the source string.

#### Parameters:

| Name            | Type                                 | Description                                             |
| :-------------- | :----------------------------------- | :------------------------------------------------------ |
| `input`         | _string_                             | is the input string to convert.                         |
| `...removeList` | (_string_ \| { `name`: _string_ })[] | is the list of strings or objects to remove from input. |

**Returns:** _string_

converted string.

Defined in: [utils/filter-functions.ts:176](https://github.com/ozum/pg-generator/blob/e8d9080/src/utils/filter-functions.ts#L176)

---

### stripSuffix

▸ **stripSuffix**(`input`: _string_, ...`removeList`: (_string_ \| { `name`: _string_ })[]): _string_

Vairadic function which strips all of the given strings or database object's names from the end of the source string.

#### Parameters:

| Name            | Type                                 | Description                                             |
| :-------------- | :----------------------------------- | :------------------------------------------------------ |
| `input`         | _string_                             | is the input string to convert.                         |
| `...removeList` | (_string_ \| { `name`: _string_ })[] | is the list of strings or objects to remove from input. |

**Returns:** _string_

converted string.

Defined in: [utils/filter-functions.ts:189](https://github.com/ozum/pg-generator/blob/e8d9080/src/utils/filter-functions.ts#L189)

---

### uniqueArray

▸ **uniqueArray**<T\>(`input`: T[]): T[]

Returns given array with unique elements by eliminating duplicate values.

#### Type parameters:

| Name | Type      |
| :--- | :-------- |
| `T`  | _unknown_ |

#### Parameters:

| Name    | Type | Description                                      |
| :------ | :--- | :----------------------------------------------- |
| `input` | T[]  | is the input array to eliminate duplicates from. |

**Returns:** T[]

the array with unique values.

Defined in: [utils/filter-functions.ts:303](https://github.com/ozum/pg-generator/blob/e8d9080/src/utils/filter-functions.ts#L303)
