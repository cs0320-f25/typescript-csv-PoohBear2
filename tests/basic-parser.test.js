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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const basic_parser_1 = require("../src/basic-parser");
const path = __importStar(require("path"));
const zod_1 = require("zod");
// --- File Path Constants ---
const SIMPLE_PATH = path.join(__dirname, "../data/simple.csv");
const HEADER_PATH = path.join(__dirname, "../data/header.csv");
const EMPTY_PATH = path.join(__dirname, "../data/empty.csv");
const COMPLEX_PATH = path.join(__dirname, "../data/complex.csv");
const USERS_PATH = path.join(__dirname, "../data/users.csv");
const INVALID_USERS_PATH = path.join(__dirname, "../data/invalid_users.csv");
// --- Zod Schemas ---
const userSchema = zod_1.z.tuple([
    zod_1.z.coerce.number().int().positive({ message: "ID must be a positive number" }),
    zod_1.z.string().email({ message: "Invalid email format" }),
    zod_1.z.enum(["Admin", "Editor", "Viewer"]),
]);
const refinedUserSchema = userSchema.refine((data) => data[1].endsWith("@company.com"), { message: "Email must be from @company.com domain" });
test("should parse a simple CSV file without a header", () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    // Assuming SIMPLE_PATH contains:
    // Alice,25,Engineer
    // Bob,30,Artist
    const generator = (0, basic_parser_1.parseCSV)(SIMPLE_PATH);
    const results = [];
    try {
        for (var _d = true, generator_1 = __asyncValues(generator), generator_1_1; generator_1_1 = yield generator_1.next(), _a = generator_1_1.done, !_a; _d = true) {
            _c = generator_1_1.value;
            _d = false;
            const value = _c;
            results.push(value);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = generator_1.return)) yield _b.call(generator_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    expect(results).toEqual([
        ["Alice", "25", "Engineer"],
        ["Bob", "30", "Artist"],
    ]);
}));
test("should parse a CSV file with a header and apply a schema", () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_2, _b, _c;
    const schema = zod_1.z.tuple([zod_1.z.string(), zod_1.z.coerce.number(), zod_1.z.string()]);
    const generator = (0, basic_parser_1.parseCSV)(HEADER_PATH, schema, true);
    const results = [];
    try {
        for (var _d = true, generator_2 = __asyncValues(generator), generator_2_1; generator_2_1 = yield generator_2.next(), _a = generator_2_1.done, !_a; _d = true) {
            _c = generator_2_1.value;
            _d = false;
            const value = _c;
            results.push(value);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = generator_2.return)) yield _b.call(generator_2);
        }
        finally { if (e_2) throw e_2.error; }
    }
    const expectedHeaders = ["name", "age", "occupation"];
    expect(results).toEqual([
        { data: ["Alice", 25, "Engineer"], headers: expectedHeaders },
        { data: ["Bob", 30, "Artist"], headers: expectedHeaders },
    ]);
}));
test("should return an empty array when parsing an empty file", () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_3, _b, _c;
    const generator = (0, basic_parser_1.parseCSV)(EMPTY_PATH);
    const results = [];
    try {
        for (var _d = true, generator_3 = __asyncValues(generator), generator_3_1; generator_3_1 = yield generator_3.next(), _a = generator_3_1.done, !_a; _d = true) {
            _c = generator_3_1.value;
            _d = false;
            const value = _c;
            results.push(value);
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = generator_3.return)) yield _b.call(generator_3);
        }
        finally { if (e_3) throw e_3.error; }
    }
    expect(results).toEqual([]);
}));
test("should correctly parse a complex CSV with quoted commas", () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_4, _b, _c;
    const generator = (0, basic_parser_1.parseCSV)(COMPLEX_PATH);
    const results = [];
    try {
        for (var _d = true, generator_4 = __asyncValues(generator), generator_4_1; generator_4_1 = yield generator_4.next(), _a = generator_4_1.done, !_a; _d = true) {
            _c = generator_4_1.value;
            _d = false;
            const value = _c;
            results.push(value);
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = generator_4.return)) yield _b.call(generator_4);
        }
        finally { if (e_4) throw e_4.error; }
    }
    expect(results[0]).toEqual(["1", "Providence, RI", "A lovely city"]);
}));
test("should correctly parse a complex CSV with escaped double quotes", () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_5, _b, _c;
    const generator = (0, basic_parser_1.parseCSV)(COMPLEX_PATH);
    const results = [];
    try {
        for (var _d = true, generator_5 = __asyncValues(generator), generator_5_1; generator_5_1 = yield generator_5.next(), _a = generator_5_1.done, !_a; _d = true) {
            _c = generator_5_1.value;
            _d = false;
            const value = _c;
            results.push(value);
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = generator_5.return)) yield _b.call(generator_5);
        }
        finally { if (e_5) throw e_5.error; }
    }
    expect(results[1]).toEqual(["2", 'He said "Hello"', "Greeting"]);
}));
test("should correctly parse a complex CSV with mixed quoted and unquoted fields", () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_6, _b, _c;
    const generator = (0, basic_parser_1.parseCSV)(COMPLEX_PATH);
    const results = [];
    try {
        for (var _d = true, generator_6 = __asyncValues(generator), generator_6_1; generator_6_1 = yield generator_6.next(), _a = generator_6_1.done, !_a; _d = true) {
            _c = generator_6_1.value;
            _d = false;
            const value = _c;
            results.push(value);
        }
    }
    catch (e_6_1) { e_6 = { error: e_6_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = generator_6.return)) yield _b.call(generator_6);
        }
        finally { if (e_6) throw e_6.error; }
    }
    expect(results[2]).toEqual(["3", "unquoted", "a field, with quotes"]);
}));
test("should correctly parse a complex CSV with trailing empty fields", () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_7, _b, _c;
    const generator = (0, basic_parser_1.parseCSV)(COMPLEX_PATH);
    const results = [];
    try {
        for (var _d = true, generator_7 = __asyncValues(generator), generator_7_1; generator_7_1 = yield generator_7.next(), _a = generator_7_1.done, !_a; _d = true) {
            _c = generator_7_1.value;
            _d = false;
            const value = _c;
            results.push(value);
        }
    }
    catch (e_7_1) { e_7 = { error: e_7_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = generator_7.return)) yield _b.call(generator_7);
        }
        finally { if (e_7) throw e_7.error; }
    }
    expect(results[3]).toEqual(["4", "trailing", ""]);
}));
test("should successfully validate a user file with a refined schema", () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_8, _b, _c;
    // Assuming USERS_PATH contains a valid user:
    // id,email,role
    // 101,valid@company.com,Admin
    const generator = (0, basic_parser_1.parseCSV)(USERS_PATH, refinedUserSchema, true);
    const results = [];
    try {
        for (var _d = true, generator_8 = __asyncValues(generator), generator_8_1; generator_8_1 = yield generator_8.next(), _a = generator_8_1.done, !_a; _d = true) {
            _c = generator_8_1.value;
            _d = false;
            const value = _c;
            results.push(value);
        }
    }
    catch (e_8_1) { e_8 = { error: e_8_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = generator_8.return)) yield _b.call(generator_8);
        }
        finally { if (e_8) throw e_8.error; }
    }
    const validUser = results.find(r => !(r instanceof basic_parser_1.CSVParseError));
    expect(validUser).toBeDefined();
    expect(validUser.data).toEqual([101, "valid@company.com", "Admin"]);
    expect(validUser.headers).toEqual(["id", "email", "role"]);
}));
test("should identify a Zod format error in an invalid user file", () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_9, _b, _c;
    const generator = (0, basic_parser_1.parseCSV)(INVALID_USERS_PATH, userSchema, true);
    const results = [];
    try {
        for (var _d = true, generator_9 = __asyncValues(generator), generator_9_1; generator_9_1 = yield generator_9.next(), _a = generator_9_1.done, !_a; _d = true) {
            _c = generator_9_1.value;
            _d = false;
            const value = _c;
            results.push(value);
        }
    }
    catch (e_9_1) { e_9 = { error: e_9_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = generator_9.return)) yield _b.call(generator_9);
        }
        finally { if (e_9) throw e_9.error; }
    }
    const error = results.find((r) => r instanceof basic_parser_1.CSVParseError && r.rowNumber === 3);
    expect(error).toBeInstanceOf(basic_parser_1.CSVParseError);
    expect(error.rawLine).toBe("102,not-an-email,Viewer");
    expect(error.zodError.issues[0].message).toBe("Invalid email format");
}));
test("should identify a Zod refinement error in an invalid user file", () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_10, _b, _c;
    const generator = (0, basic_parser_1.parseCSV)(INVALID_USERS_PATH, refinedUserSchema, true);
    const results = [];
    try {
        for (var _d = true, generator_10 = __asyncValues(generator), generator_10_1; generator_10_1 = yield generator_10.next(), _a = generator_10_1.done, !_a; _d = true) {
            _c = generator_10_1.value;
            _d = false;
            const value = _c;
            results.push(value);
        }
    }
    catch (e_10_1) { e_10 = { error: e_10_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = generator_10.return)) yield _b.call(generator_10);
        }
        finally { if (e_10) throw e_10.error; }
    }
    const error = results.find((r) => r instanceof basic_parser_1.CSVParseError && r.rowNumber === 4);
    expect(error).toBeInstanceOf(basic_parser_1.CSVParseError);
    expect(error.rawLine).toBe("103,external@gmail.com,Editor");
    expect(error.zodError.issues[0].message).toBe("Email must be from @company.com domain");
}));
test("should identify a Zod coercion error in an invalid user file", () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_11, _b, _c;
    const generator = (0, basic_parser_1.parseCSV)(INVALID_USERS_PATH, userSchema, true);
    const results = [];
    try {
        for (var _d = true, generator_11 = __asyncValues(generator), generator_11_1; generator_11_1 = yield generator_11.next(), _a = generator_11_1.done, !_a; _d = true) {
            _c = generator_11_1.value;
            _d = false;
            const value = _c;
            results.push(value);
        }
    }
    catch (e_11_1) { e_11 = { error: e_11_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = generator_11.return)) yield _b.call(generator_11);
        }
        finally { if (e_11) throw e_11.error; }
    }
    const error = results.find((r) => r instanceof basic_parser_1.CSVParseError && r.rowNumber === 2);
    expect(error).toBeInstanceOf(basic_parser_1.CSVParseError);
    expect(error.rawLine).toBe("not-a-number,valid@email.com,Admin");
    expect(error.zodError.issues[0].message).toMatch(/expected number/i);
}));
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
    expect(line.match(regexAI)).toEqual(['"a,b",', 'c', '']);
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
    expect(line.match(regexAI)).toEqual(['a,', ',', 'c', '']);
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
    expect(line.match(regexAI)).toEqual(['"a ""b"" c",', 'd', '']);
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
    expect(line.match(regexAI)).toEqual(['a,', 'b,', '']);
});
test('Regex Comparison: Regex 3 and 4 should have different match structures', () => {
    const line = 'a,"b"';
    // Includes comma with "a", then quoted field
    expect(line.match(regex3)).toEqual(['a,', '"b"', '']);
    // Groups differently, separating quoted field oddly
    expect(line.match(regex4)).toEqual(['a', ',"b"']);
    // Similar to regex3, but slightly cleaner
    expect(line.match(regexAI)).toEqual(['a,', '"b"', '']);
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
    expect(line.match(regexAI)).toEqual(['a,', 'b"c,', 'd', '']);
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
    expect(line.match(regexAI)).toEqual(['a,', ' "b" ,', 'c', '']);
});
