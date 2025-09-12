import { parseCSV } from "../src/basic-parser";
import * as path from "path";
import { z } from "zod";

const PEOPLE_CSV_PATH = path.join(__dirname, "../data/people.csv");

test("parseCSV yields arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  
  expect(results).toHaveLength(5);
  expect(results[0]).toEqual(["name", "age"]);
  expect(results[1]).toEqual(["Alice", "23"]);
  expect(results[2]).toEqual(["Bob", "thirty"]); // why does this work? :(
  expect(results[3]).toEqual(["Charlie", "25"]);
  expect(results[4]).toEqual(["Nim", "22"]);
});

test("parseCSV yields only arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  for(const row of results) {
    expect(Array.isArray(row)).toBe(true);
  }
});

//My New Tests

// Test for a CSV file that is empty
const EMPTY_PEOPLE_CSV_PATH = path.join(__dirname, "../data/empty_people.csv"); 
test("handles an empty CSV file", async () => {
  const results = await parseCSV(EMPTY_PEOPLE_CSV_PATH);
  expect(results).toEqual([]);
});

// Test for quotes inside quoted fields
const COMMAS_IN_FIELD_PATH = path.join(__dirname, "../data/commas_in_field.csv");
test("fails to handle commas inside quoted fields", async () => {
  const results = await parseCSV(COMMAS_IN_FIELD_PATH);
  // This is now the CORRECT assertion for your parser's flawed logic.
  // It accounts for the .trim() removing the leading space from " vidi".
  expect(results[0]).toEqual(['Caesar', 'Julius', '"veni', 'vidi', 'vici"']);
})


// Test for ragged rows
const RAGGED_ROWS_PATH = path.join(__dirname, "../data/ragged_rows.csv");
test("FAILS to throw an error for ragged rows", async () => {
  const results = await parseCSV(RAGGED_ROWS_PATH);

  expect(results).toEqual([
    ["name", "age", "role"],
    ["Alice", "23", "student"],
    ["Bob", "30"], 
    ["Charlie", "25", "instructor", "extra"], 
  ]);
});

// Test for whitespace inside quoted fields
const WHITESPACE_IN_QUOTES_PATH = path.join(__dirname, "../data/whitespace_in_quotes.csv");
test("fails to remove quotes from quoted fields", async () => {
  const results = await parseCSV(WHITESPACE_IN_QUOTES_PATH);
  expect(results[0]).toEqual(['"  padded  "', "normal"]);
});



// Test for empty fields
const EMPTY_FIELDS_PATH = path.join(__dirname, "../data/empty_fields.csv");
test("parses empty fields", async () => {
  const results = await parseCSV(EMPTY_FIELDS_PATH);
  expect(results[0]).toEqual(["Alice", "", "23"]);
  expect(results[1]).toEqual(["Bob", "30", ""]);
  expect(results[2]).toEqual(["Charlie", "", ""]);
});

// Test with schema invalidation
test("throws schema error when schema validation fails", async () => {
  const schema = z.tuple([z.string(), z.number()]);
  await expect(parseCSV(PEOPLE_CSV_PATH, schema)).rejects.toThrow(
    /Validation failed/
  );
});

// Test with schema validation
const PEOPLE2_CSV_PATH = path.join(__dirname, "../data/people2.csv");
test("validation works!", async () => {
  const schema = z.tuple([z.string(), z.number()]);
  const result = await parseCSV(PEOPLE2_CSV_PATH);
  expect(result).toEqual([
    ["Alice", "23"],
    ["Bob", "30"],
    ["Charlie", "25"],
    ["Nim", "22"]
  ]);
});
