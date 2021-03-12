import { Column, Table } from "pg-structure";
import { filterFunctions } from "../../src/index";

describe("filter functions", () => {
  describe("clearDefault", () => {
    it("should return string.", () => {
      expect(filterFunctions.clearDefault("a")).toBe('"a"');
    });

    it("should return undefined for undefined and null.", () => {
      const clearNull = filterFunctions.clearDefault(null);
      const clearUndefined = filterFunctions.clearDefault(undefined);
      expect([clearNull, clearUndefined]).toEqual([undefined, undefined]);
    });

    it("should return only quotes for empty string.", () => {
      expect(filterFunctions.clearDefault("")).toBe('""');
    });

    it("should convert PostgreSQL single quote.", () => {
      expect(filterFunctions.clearDefault("''a''")).toBe(`"'a'"`);
    });

    it("should preserve double quote.", () => {
      expect(filterFunctions.clearDefault('"a"')).toBe('"a"');
    });

    it("should return number as it is.", () => {
      expect(filterFunctions.clearDefault("3")).toBe("3");
    });

    it("should return true string as boolean.", () => {
      expect(filterFunctions.clearDefault("true")).toBe("true");
    });

    it("should return false string as boolean.", () => {
      expect(filterFunctions.clearDefault("false")).toBe("false");
    });
  });

  describe("camelCase", () => {
    it("should return empty string for undefined.", () => {
      expect(filterFunctions.camelCase()).toBe("");
    });

    it("should return camel case string.", () => {
      expect(filterFunctions.camelCase("line-item")).toBe("lineItem");
    });
  });

  describe("pascalCase", () => {
    it("should return empty string for undefined.", () => {
      expect(filterFunctions.pascalCase()).toBe("");
    });

    it("should return pascal case string.", () => {
      expect(filterFunctions.pascalCase("line-item")).toBe("LineItem");
    });
  });

  describe("classCase", () => {
    it("should return empty string for undefined.", () => {
      expect(filterFunctions.classCase()).toBe("");
    });

    it("should return pascal case string.", () => {
      expect(filterFunctions.classCase("line-item")).toBe("LineItem");
    });
  });

  describe("snakeCase", () => {
    it("should return empty string for undefined.", () => {
      expect(filterFunctions.snakeCase()).toBe("");
    });

    it("should return snake case string.", () => {
      expect(filterFunctions.snakeCase("line-item")).toBe("line_item");
    });
  });

  describe("dashCase", () => {
    it("should return empty string for undefined.", () => {
      expect(filterFunctions.dashCase()).toBe("");
    });

    it("should return dash case string.", () => {
      expect(filterFunctions.dashCase("lineItem")).toBe("line-item");
    });
  });

  describe("titleCase", () => {
    it("should return empty string for undefined.", () => {
      expect(filterFunctions.titleCase()).toBe("");
    });

    it("should return title case string.", () => {
      expect(filterFunctions.titleCase("line item")).toBe("Line Item");
    });
  });

  describe("singular", () => {
    it("should return empty string for undefined.", () => {
      expect(filterFunctions.singular()).toBe("");
    });

    it("should return singular string.", () => {
      expect(filterFunctions.singular("line items")).toBe("line item");
    });
  });

  describe("plural", () => {
    it("should return empty string for undefined.", () => {
      expect(filterFunctions.plural()).toBe("");
    });

    it("should return plural string.", () => {
      expect(filterFunctions.plural("line item")).toBe("line items");
    });
  });

  describe("human", () => {
    it("should return empty string for undefined.", () => {
      expect(filterFunctions.human()).toBe("");
    });

    it("should return human readable string.", () => {
      expect(filterFunctions.human("LineItem")).toBe("Line item");
    });

    it("should return human readable string with lower case first letter.", () => {
      expect(filterFunctions.human("LineItem", true)).toBe("line item");
    });
  });

  describe("lcFirst", () => {
    it("should return empty string for undefined.", () => {
      expect(filterFunctions.lcFirst()).toBe("");
    });

    it("should return string with first letter in lower case.", () => {
      expect(filterFunctions.lcFirst("Line_item")).toBe("line_item");
    });
  });

  describe("ucFirst", () => {
    it("should return empty string for undefined.", () => {
      expect(filterFunctions.ucFirst()).toBe("");
    });

    it("should return string with first letter in upper case.", () => {
      expect(filterFunctions.ucFirst("line_item")).toBe("Line_item");
    });
  });

  describe("quote", () => {
    it("should return empty string for undefined.", () => {
      expect(filterFunctions.quote()).toBe("");
    });

    it("should return string within quotes.", () => {
      expect(filterFunctions.quote("line_item")).toBe('"line_item"');
    });
  });

  describe("singleQuote", () => {
    it("should return empty string for undefined.", () => {
      expect(filterFunctions.singleQuote()).toBe("");
    });

    it("should return string within single quotes.", () => {
      expect(filterFunctions.singleQuote("line_item")).toBe("'line_item'");
    });
  });

  describe("doubleQuote", () => {
    it("should return empty string for undefined.", () => {
      expect(filterFunctions.doubleQuote()).toBe("");
    });

    it("should return string within double quotes.", () => {
      expect(filterFunctions.doubleQuote("line_item")).toBe('"line_item"');
    });
  });

  describe("stripPrefix", () => {
    it("should return empty string for undefined.", () => {
      expect(filterFunctions.stripPrefix(undefined, "x")).toBe("");
    });

    it("should remove given string from beginning.", () => {
      expect(filterFunctions.stripPrefix("xLineItem", "x")).toBe("LineItem");
    });

    it("should remove given db objects's name from beginning.", () => {
      expect(filterFunctions.stripPrefix("xLineItem", { name: "x" })).toBe("LineItem");
    });
  });

  describe("stripSuffix", () => {
    it("should return empty string for undefined.", () => {
      expect(filterFunctions.stripSuffix(undefined, "x")).toBe("");
    });

    it("should remove given string from end.", () => {
      expect(filterFunctions.stripSuffix("LineItemX", "X")).toBe("LineItem");
    });

    it("should remove given db objects's name from end.", () => {
      expect(filterFunctions.stripSuffix("LineItemX", { name: "X" })).toBe("LineItem");
    });
  });

  describe("strip", () => {
    it("should return empty string for undefined.", () => {
      expect(filterFunctions.strip(undefined, "x")).toBe("");
    });

    it("should remove given string from string.", () => {
      expect(filterFunctions.strip("LineXItem", "X")).toBe("LineItem");
    });

    it("should remove given db objects's name from string.", () => {
      expect(filterFunctions.strip("LineXItem", { name: "X" })).toBe("LineItem");
    });
  });

  describe("padRight", () => {
    it("should return empty string for undefined.", () => {
      expect(filterFunctions.padRight(undefined, 2, " ")).toBe("  ");
    });

    it("should pad given string's end.", () => {
      expect(filterFunctions.padRight("ABCD", 8)).toBe("ABCD    ");
    });

    it("should return string padded with default value and length.", () => {
      expect(filterFunctions.padRight("ABCD")).toBe("ABCD                ");
    });

    it("should return string if total length is lesser than string's length.", () => {
      expect(filterFunctions.padRight("ABCD", 2)).toBe("ABCD");
    });
  });

  describe("maxLength", () => {
    it("should return empty string for undefined.", () => {
      expect(filterFunctions.maxLength(undefined, 2)).toBe("");
    });

    it("should cut excess part.", () => {
      expect(filterFunctions.maxLength("ABCDEF", 4)).toBe("ABCD...");
    });

    it("should cut excess part with default length.", () => {
      expect(filterFunctions.maxLength("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")).toBe(
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA..."
      );
    });
  });

  describe("fill", () => {
    it("should return filled string for undefined.", () => {
      expect(filterFunctions.fill(undefined, 2)).toBe("  ");
    });

    it("should fill string.", () => {
      expect(filterFunctions.fill("ABCDEF", 8, "-")).toBe("ABCDEF--");
    });

    it("should fill string with default length.", () => {
      expect(filterFunctions.fill("ABCDEF")).toBe("ABCDEF              ");
    });
  });

  describe("wrap", () => {
    it("should return empty string for undefined.", () => {
      expect(filterFunctions.wrap(undefined)).toBe("");
    });

    it("should wrap string with default value.", () => {
      expect(filterFunctions.wrap("ABC")).toBe("{ABC}");
    });

    it("should wrap string with custom single character.", () => {
      expect(filterFunctions.wrap("ABC", "-")).toBe("-ABC-");
    });

    it("should wrap string with custom double characters.", () => {
      expect(filterFunctions.wrap("ABC", "[]")).toBe("[ABC]");
    });
  });

  describe("wrapIf", () => {
    it("should return empty string for undefined.", () => {
      expect(filterFunctions.wrapIf(undefined, true)).toBe("");
    });

    it("should wrap string with default value if condition met.", () => {
      expect(filterFunctions.wrapIf("ABC", true)).toBe("{ABC}");
    });

    it("should wrap string with custom character.", () => {
      expect(filterFunctions.wrapIf("ABC", true, "[]")).toBe("[ABC]");
    });

    it("should not wrap string if condition not met.", () => {
      expect(filterFunctions.wrapIf("ABC", false)).toBe("ABC");
    });
  });

  describe("linePrefix", () => {
    it("should prefixed string for undefined.", () => {
      expect(filterFunctions.linePrefix(undefined, "//")).toBe("//");
    });

    it("should prefix each line.", () => {
      expect(filterFunctions.linePrefix("a\nb", "//")).toBe("//a\n//b");
    });
  });

  describe("stringify", () => {
    it("should return number as a string.", () => {
      expect(filterFunctions.stringify(1)).toBe("1");
    });

    it("should return undefined as a string for undefined.", () => {
      expect(filterFunctions.stringify(undefined)).toBe("undefined");
    });

    it("should strigify object.", () => {
      expect(filterFunctions.stringify({ name: "George" }, { indent: 2 })).toBe("{ name: 'George' }");
    });

    it("should strigify array.", () => {
      expect(filterFunctions.stringify(["a", "b"])).toBe("[ 'a', 'b' ]");
    });

    it("should strigify array as raw.", () => {
      expect(filterFunctions.stringify(["a", "b"], { raw: true })).toBe("a, b");
    });

    it("should strigify object as raw.", () => {
      expect(filterFunctions.stringify({ name: "George" }, { raw: true, nullToUndef: true })).toBe("name: George");
    });

    it("should strigify object as raw with indent.", () => {
      expect(filterFunctions.stringify({ name: "George" }, { raw: true, nullToUndef: true, indent: 2 })).toBe("name: George");
    });

    it("should convert null to undefined.", () => {
      expect(filterFunctions.stringify({ name: null, opt: [null, null] }, { nullToUndef: true })).toBe(
        "{ name: undefined, opt: [ undefined, undefined ] }"
      );
    });
  });

  describe("singleLine", () => {
    it("should return empty string for undefined.", () => {
      expect(filterFunctions.singleLine(undefined)).toBe("");
    });

    it("should escape new lines.", () => {
      expect(filterFunctions.singleLine("a\nb")).toBe("a\\nb");
    });
  });

  describe("uniqueArray", () => {
    it("should return empty array for undefined.", () => {
      expect(filterFunctions.uniqueArray(undefined)).toEqual([]);
    });

    it("should eliminate duplicates.", () => {
      expect(filterFunctions.uniqueArray(["a", "a", "b"])).toEqual(["a", "b"]);
    });
  });

  describe("listAttribute", () => {
    const input = [
      { name: "x", surname: "y" },
      { name: "k", surname: "l" },
    ];

    it("should list attributes.", () => {
      expect(filterFunctions.listAttribute(input)).toBe("x, k");
    });

    it("should list attributes with quotes, joiner and wrapped for multiple elements.", () => {
      expect(filterFunctions.listAttribute(input, "name", { quote: "single", join: "-", wrap: "[]" })).toBe("['x'-'k']");
    });

    it("should list attributes not wrapped for single element.", () => {
      expect(filterFunctions.listAttribute([{ name: "x" }], "name", { wrap: "[]" })).toBe("x");
    });
  });

  describe("wordWrap", () => {
    it("should return empty string for undefined.", () => {
      expect(filterFunctions.wordWrap(undefined)).toBe("");
    });

    it("should word wrap given text.", () => {
      expect(filterFunctions.wordWrap("The quick brown fox", 10)).toBe("The quick\nbrown fox");
    });

    it("should word wrap given text with start and stop.", () => {
      expect(filterFunctions.wordWrap("The quick brown fox", 2, 15)).toBe("  The quick\n  brown fox");
    });

    it("should word wrap given text with default start value.", () => {
      expect(filterFunctions.wordWrap("The quick brown fox")).toBe("The quick brown fox");
    });
  });

  describe("dboClassName", () => {
    const table = { fullName: "public.member", name: "member" } as Table;

    it("should return empty string for undefined.", () => {
      expect(filterFunctions.dboClassName(undefined)).toBe("");
    });

    it("should return a class name for given database object.", () => {
      expect(filterFunctions.dboClassName(table)).toEqual("Member");
    });

    it("should return a class name for given database object with schema name.", () => {
      expect(filterFunctions.dboClassName(table, true)).toEqual("PublicMember");
    });
  });

  describe("dboColumnTypeModifier", () => {
    const booleanColumn = {} as Column;
    const textColumn = { length: 10 } as Column;
    const precisionColumn = { precision: 10 } as Column;
    const numericColumn = { precision: 10, scale: 4 } as Column;

    it("should return empty string for undefined.", () => {
      expect(filterFunctions.dboColumnTypeModifier(undefined)).toBe("");
    });

    it("should return empty string for non-modifier types.", () => {
      expect(filterFunctions.dboColumnTypeModifier(booleanColumn)).toEqual("");
    });

    it("should return length modifier.", () => {
      expect(filterFunctions.dboColumnTypeModifier(textColumn)).toEqual("(10)");
    });

    it("should return precision modifier.", () => {
      expect(filterFunctions.dboColumnTypeModifier(precisionColumn)).toEqual("(10)");
    });

    it("should return precision and scale modifier.", () => {
      expect(filterFunctions.dboColumnTypeModifier(numericColumn)).toEqual("(10, 4)");
    });
  });
});
