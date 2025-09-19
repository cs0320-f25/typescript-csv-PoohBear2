import { parseCSV, CSVParseError, ParsedRecord } from "../src/basic-parser";
import * as path from "path";
import { z } from "zod";

// --- File Path Constants ---
const SIMPLE_PATH = path.join(__dirname, "../data/simple.csv");
const HEADER_PATH = path.join(__dirname, "../data/header.csv");
const EMPTY_PATH = path.join(__dirname, "../data/empty.csv");
const COMPLEX_PATH = path.join(__dirname, "../data/complex.csv");
const USERS_PATH = path.join(__dirname, "../data/users.csv");
const INVALID_USERS_PATH = path.join(__dirname, "../data/invalid_users.csv");

// --- Zod Schemas ---
const userSchema = z.tuple([
  z.coerce.number().int().positive({ message: "ID must be a positive number" }),
  z.string().email({ message: "Invalid email format" }),
  z.enum(["Admin", "Editor", "Viewer"]),
]);

const refinedUserSchema = userSchema.refine(
    (data) => data[1].endsWith("@company.com"),
    { message: "Email must be from @company.com domain" }
);

test("should parse a simple CSV file without a header", async () => {
  // Assuming SIMPLE_PATH contains:
  // Alice,25,Engineer
  // Bob,30,Artist
  const generator = parseCSV(SIMPLE_PATH);
  const results = [];
  for await (const value of generator) {
    results.push(value);
  }
  expect(results).toEqual([
    ["Alice", "25", "Engineer"],
    ["Bob", "30", "Artist"],
  ]);
});

test("should parse a CSV file with a header and apply a schema", async () => {
  const schema = z.tuple([z.string(), z.coerce.number(), z.string()]);
  const generator = parseCSV(HEADER_PATH, schema, true);
  const results = [];
  for await (const value of generator) {
    results.push(value);
  }
  
  const expectedHeaders = ["name", "age", "occupation"];
  expect(results).toEqual([
    { data: ["Alice", 25, "Engineer"], headers: expectedHeaders },
    { data: ["Bob", 30, "Artist"], headers: expectedHeaders },
  ]);
});

test("should return an empty array when parsing an empty file", async () => {
  const generator = parseCSV(EMPTY_PATH);
  const results = [];
  for await (const value of generator) {
    results.push(value);
  }
  expect(results).toEqual([]);
});

test("should correctly parse a complex CSV with quoted commas", async () => {
  const generator = parseCSV(COMPLEX_PATH);
  const results = [];
  for await (const value of generator) {
    results.push(value);
  }
  expect(results[0]).toEqual(["1", "Providence, RI", "A lovely city"]);
});

test("should correctly parse a complex CSV with escaped double quotes", async () => {
  const generator = parseCSV(COMPLEX_PATH);
  const results = [];
  for await (const value of generator) {
    results.push(value);
  }
  expect(results[1]).toEqual(["2", 'He said "Hello"', "Greeting"]);
});

test("should correctly parse a complex CSV with mixed quoted and unquoted fields", async () => {
  const generator = parseCSV(COMPLEX_PATH);
  const results = [];
  for await (const value of generator) {
    results.push(value);
  }
  expect(results[2]).toEqual(["3", "unquoted", "a field, with quotes"]);
});

test("should correctly parse a complex CSV with trailing empty fields", async () => {
    const generator = parseCSV(COMPLEX_PATH);
    const results = [];
    for await (const value of generator) {
        results.push(value);
    }
    expect(results[3]).toEqual(["4", "trailing", ""]);
});

test("should successfully validate a user file with a refined schema", async () => {
    // Assuming USERS_PATH contains a valid user:
    // id,email,role
    // 101,valid@company.com,Admin
    const generator = parseCSV(USERS_PATH, refinedUserSchema, true);
    const results = [];
    for await (const value of generator) {
        results.push(value);
    }
    const validUser = results.find(r => !(r instanceof CSVParseError)) as ParsedRecord<any>;
    expect(validUser).toBeDefined();
    expect(validUser.data).toEqual([101, "valid@company.com", "Admin"]);
    expect(validUser.headers).toEqual(["id", "email", "role"]);
});

test("should identify a Zod format error in an invalid user file", async () => {
    const generator = parseCSV(INVALID_USERS_PATH, userSchema, true);
    const results = [];
    for await (const value of generator) {
        results.push(value);
    }
    const error = results.find((r) => r instanceof CSVParseError && r.rowNumber === 3) as CSVParseError;
    expect(error).toBeInstanceOf(CSVParseError);
    expect(error.rawLine).toBe("102,not-an-email,Viewer");
    expect(error.zodError.issues[0].message).toBe("Invalid email format");
});

test("should identify a Zod refinement error in an invalid user file", async () => {
    const generator = parseCSV(INVALID_USERS_PATH, refinedUserSchema, true);
    const results = [];
    for await (const value of generator) {
        results.push(value);
    }
    const error = results.find((r) => r instanceof CSVParseError && r.rowNumber === 4) as CSVParseError;
    expect(error).toBeInstanceOf(CSVParseError);
    expect(error.rawLine).toBe("103,external@gmail.com,Editor");
    expect(error.zodError.issues[0].message).toBe("Email must be from @company.com domain");
});

test("should identify a Zod coercion error in an invalid user file", async () => {
    const generator = parseCSV(INVALID_USERS_PATH, userSchema, true);
    const results = [];
    for await (const value of generator) {
        results.push(value);
    }
    const error = results.find((r) => r instanceof CSVParseError && r.rowNumber === 2) as CSVParseError;
    expect(error).toBeInstanceOf(CSVParseError);
    expect(error.rawLine).toBe("not-a-number,valid@email.com,Admin");
    expect(error.zodError.issues[0].message).toMatch(/expected number/i);
});

//----------------------------- Test Regexes ------------------------------
// These tests compare different regex patterns and do not use the CSV parser directly.

const regex1 = /[^,]+/g;
const regex2 = /"([^"]*)"|[^,]+/g;
const regex3 = /("([^"]*(?:""[^"]*)*)"|[^,]*)(,|$)/g;
const regex4 = /(?:^|,)(?:"((?:[^"]|"")*)"|([^",]*))/g;
const regexAI = /(?:"((?:[^"]|"")*)"|([^,]*))(?:,|$)/g;

test('Regex Comparison: A field containing a comma should be handled correctly', () => {
  const line = '"a,b",c';
  // Splits quoted field incorrectly
  expect(line.match(regex1)).toEqual(['"a', 'b"', 'c']);
  // Keeps "a,b" together
  expect(line.match(regex2)).toEqual(['"a,b"', 'c']);
  // Captures field with comma and delimiter structure
  expect(line.match(regex3)).toEqual(['"a,b",', 'c', '']);
  // Breaks into quoted part and comma separately
  expect(line.match(regex4)).toEqual(['"a,b"', ',c']);
  // Preserves quoted field and trailing piece
  expect(line.match(regexAI)).toEqual([ '"a,b",', 'c', '' ]);
});

test('Regex Comparison: Empty fields should be captured', () => {
  const line = 'a,,c';
  // Loses the empty middle field
  expect(line.match(regex1)).toEqual(['a', 'c']);
  // Loses the empty middle field
  expect(line.match(regex2)).toEqual(['a', 'c']);
  // Correctly includes the empty middle field
  expect(line.match(regex3)).toEqual(['a,', ',', 'c', '']);
  // Captures but not cleanly separated
  expect(line.match(regex4)).toEqual(['a', ',', ',c']);
  // Includes the empty middle field
  expect(line.match(regexAI)).toEqual([ 'a,', ',', 'c', '' ]);
});

test('Regex Comparison: Escaped double quotes should be handled', () => {
  const line = '"a ""b"" c",d';
  // Splits quoted text into fragments
  expect(line.match(regex2)).toEqual(['"a "', '"b"', '" c"', 'd']);
  // Captures entire quoted field and following value
  expect(line.match(regex3)).toEqual(['"a ""b"" c",', 'd', '']);
  // Captures entire quoted field and following value
  expect(line.match(regex4)).toEqual(['"a ""b"" c"', ',d']);
  // Captures entire quoted field and following value
  expect(line.match(regexAI)).toEqual([ '"a ""b"" c",', 'd', '' ]);
});

test('Regex Comparison: A trailing empty field should be captured', () => {
  const line = 'a,b,';
  // Drops trailing empty field
  expect(line.match(regex1)).toEqual(['a', 'b']);
  // Drops trailing empty field
  expect(line.match(regex2)).toEqual(['a', 'b']);
  // Captures trailing empty field
  expect(line.match(regex3)).toEqual(['a,', 'b,', '']);
  // Captures but in an unusual structure
  expect(line.match(regex4)).toEqual(['a', ',b', ',']);
  // Captures trailing empty field
  expect(line.match(regexAI)).toEqual([ 'a,', 'b,', '' ]);
});

test('Regex Comparison: Regex 3 and 4 should have different match structures', () => {
  const line = 'a,"b"';
  // Includes comma with "a", then quoted field
  expect(line.match(regex3)).toEqual(['a,', '"b"', '']);
  // Groups differently, separating quoted field oddly
  expect(line.match(regex4)).toEqual(['a', ',"b"']);
  // Similar to regex3, but slightly cleaner
  expect(line.match(regexAI)).toEqual([ 'a,', '"b"', '' ]);
});

test('Regex Comparison: A quote in an unquoted field should be handled differently', () => {
  const line = 'a,b"c,d';
  // Splits at commas, includes quote inside token
  expect(line.match(regex1)).toEqual(['a', 'b"c', 'd']);
  // Similar split with quote inside token
  expect(line.match(regex2)).toEqual(['a', 'b"c', 'd']);
  // Captures including comma delimiters
  expect(line.match(regex3)).toEqual(['a,', 'b"c,', 'd', '']);
  // Captures but segments differently
  expect(line.match(regex4)).toEqual(['a', ',b', ',d']);
  // Captures fields with delimiter structure
  expect(line.match(regexAI)).toEqual([ 'a,', 'b"c,', 'd', '' ]);
});

test('Regex Comparison: Whitespace around a quoted field', () => {
  const line = 'a, "b" ,c';
  // Preserves surrounding whitespace
  expect(line.match(regex1)).toEqual(['a', ' "b" ', 'c']);
  // Preserves surrounding whitespace
  expect(line.match(regex2)).toEqual(['a', ' "b" ', 'c']);
  // Captures including delimiters and whitespace
  expect(line.match(regex3)).toEqual(['a,', ' "b" ,', 'c', '']);
  // Breaks differently, comma attached to whitespace
  expect(line.match(regex4)).toEqual(['a', ', ', ',c']);
  // Captures with whitespace preserved
  expect(line.match(regexAI)).toEqual([ 'a,', ' "b" ,', 'c', '' ]);
});
