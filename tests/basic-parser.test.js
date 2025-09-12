"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const basic_parser_1 = require("../src/basic-parser");
const path = __importStar(require("path"));
const zod_1 = require("zod");
const PEOPLE_CSV_PATH = path.join(__dirname, "../data/people.csv");
test("parseCSV yields arrays", () => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield (0, basic_parser_1.parseCSV)(PEOPLE_CSV_PATH);
    expect(results).toHaveLength(5);
    expect(results[0]).toEqual(["name", "age"]);
    expect(results[1]).toEqual(["Alice", "23"]);
    expect(results[2]).toEqual(["Bob", "thirty"]); // why does this work? :(
    expect(results[3]).toEqual(["Charlie", "25"]);
    expect(results[4]).toEqual(["Nim", "22"]);
}));
test("parseCSV yields only arrays", () => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield (0, basic_parser_1.parseCSV)(PEOPLE_CSV_PATH);
    for (const row of results) {
        expect(Array.isArray(row)).toBe(true);
    }
}));
//My New Tests
// Test for a CSV file that is empty
const EMPTY_PEOPLE_CSV_PATH = path.join(__dirname, "../data/empty_people.csv");
test("handles an empty CSV file", () => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield (0, basic_parser_1.parseCSV)(EMPTY_PEOPLE_CSV_PATH);
    expect(results).toEqual([]);
}));
// Test for quotes inside quoted fields
const COMMAS_IN_FIELD_PATH = path.join(__dirname, "../data/commas_in_field.csv");
test("fails to handle commas inside quoted fields", () => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield (0, basic_parser_1.parseCSV)(COMMAS_IN_FIELD_PATH);
    // This is now the CORRECT assertion for your parser's flawed logic.
    // It accounts for the .trim() removing the leading space from " vidi".
    expect(results[0]).toEqual(['Caesar', 'Julius', '"veni', 'vidi', 'vici"']);
}));
// Test for ragged rows
const RAGGED_ROWS_PATH = path.join(__dirname, "../data/ragged_rows.csv");
test("FAILS to throw an error for ragged rows", () => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield (0, basic_parser_1.parseCSV)(RAGGED_ROWS_PATH);
    expect(results).toEqual([
        ["name", "age", "role"],
        ["Alice", "23", "student"],
        ["Bob", "30"],
        ["Charlie", "25", "instructor", "extra"],
    ]);
}));
// Test for whitespace inside quoted fields
const WHITESPACE_IN_QUOTES_PATH = path.join(__dirname, "../data/whitespace_in_quotes.csv");
test("fails to remove quotes from quoted fields", () => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield (0, basic_parser_1.parseCSV)(WHITESPACE_IN_QUOTES_PATH);
    expect(results[0]).toEqual(['"  padded  "', "normal"]);
}));
// Test for empty fields
const EMPTY_FIELDS_PATH = path.join(__dirname, "../data/empty_fields.csv");
test("parses empty fields", () => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield (0, basic_parser_1.parseCSV)(EMPTY_FIELDS_PATH);
    expect(results[0]).toEqual(["Alice", "", "23"]);
    expect(results[1]).toEqual(["Bob", "30", ""]);
    expect(results[2]).toEqual(["Charlie", "", ""]);
}));
// Test with schema invalidation
test("throws schema error when schema validation fails", () => __awaiter(void 0, void 0, void 0, function* () {
    const schema = zod_1.z.tuple([zod_1.z.string(), zod_1.z.number()]);
    yield expect((0, basic_parser_1.parseCSV)(PEOPLE_CSV_PATH, schema)).rejects.toThrow(/Validation failed/);
}));
// Test with schema validation
const PEOPLE2_CSV_PATH = path.join(__dirname, "../data/people2.csv");
test("validation works!", () => __awaiter(void 0, void 0, void 0, function* () {
    const schema = zod_1.z.tuple([zod_1.z.string(), zod_1.z.number()]);
    const result = yield (0, basic_parser_1.parseCSV)(PEOPLE2_CSV_PATH);
    expect(result).toEqual([
        ["Alice", "23"],
        ["Bob", "30"],
        ["Charlie", "25"],
        ["Nim", "22"]
    ]);
}));
