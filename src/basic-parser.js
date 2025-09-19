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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSVParseError = void 0;
exports.parseCSV = parseCSV;
const fs = __importStar(require("fs"));
const readline = __importStar(require("readline"));
/**
 * A custom error class for CSV parsing issues. It bundles detailed
 * context to help developers debug invalid rows.
 */
class CSVParseError extends Error {
    constructor(message, rowNumber, rawLine, zodError) {
        super(message);
        // Set the name for easy identification, e.g., `if (e instanceof CSVParseError)`
        this.name = "CSVParseError";
        this.rowNumber = rowNumber;
        this.rawLine = rawLine;
        this.zodError = zodError;
    }
}
exports.CSVParseError = CSVParseError;
/**
 * An asynchronous generator that parses a CSV file, yielding one row at a time.
 * This approach is memory-efficient and suitable for very large files.
 *
 * @param path The path to the file being loaded.
 * @param schema An optional Zod schema to validate and type each data row.
 * @param hasHeader A boolean indicating if the CSV has a header row. Defaults to false.
 * @yields A `ParsedRecord<T>` for a valid row with a schema, a `string[]` for a
 * valid row without a schema, or a `CSVParseError` for an invalid row.
 */
function parseCSV(path_1, schema_1) {
    return __asyncGenerator(this, arguments, function* parseCSV_1(path, schema, hasHeader = false) {
        var _a, e_1, _b, _c;
        const fileStream = fs.createReadStream(path);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity,
        });
        let headerRow = undefined;
        let rowNumber = 0;
        let isFirstRow = true;
        try {
            for (var _d = true, rl_1 = __asyncValues(rl), rl_1_1; rl_1_1 = yield __await(rl_1.next()), _a = rl_1_1.done, !_a; _d = true) {
                _c = rl_1_1.value;
                _d = false;
                const line = _c;
                rowNumber++;
                if (line.trim().length === 0)
                    continue;
                // --- MODIFICATION START ---
                // Replaced `line.split(',')` with a robust regex-based parser to correctly handle
                // fields enclosed in double quotes, allowing them to contain commas.
                const fields = [];
                const regex = /(?:"((?:[^"]|"")*)"|([^,]*))(?:,|$)/g;
                let match;
                // This loop iterates through all successive matches of the regex on the string.
                while ((match = regex.exec(line))) {
                    // This check prevents an infinite loop on some empty lines.
                    if (match.index === line.length && match[0] === "") {
                        break;
                    }
                    // `match[1]` captures quoted content, `match[2]` captures unquoted.
                    const quotedContent = match[1];
                    const unquotedContent = match[2];
                    // If the field was quoted, unescape any double-double-quotes ("") back to a single (").
                    // Otherwise, use the unquoted content.
                    const value = quotedContent !== undefined
                        ? quotedContent.replace(/""/g, '"')
                        : unquotedContent;
                    fields.push(value);
                }
                if (line.endsWith(",")) {
                    fields.push("");
                }
                // This regex pattern can leave an extra empty string if the line doesn't end
                // with a comma. This removes that artifact for clean output.
                if (fields.length > 1 && fields[fields.length - 1] === '' && !line.endsWith(',')) {
                    fields.pop();
                }
                const values = fields;
                // --- MODIFICATION END ---
                if (isFirstRow && hasHeader) {
                    headerRow = values;
                    isFirstRow = false;
                    continue;
                }
                isFirstRow = false;
                if (schema) {
                    const parseResult = schema.safeParse(values);
                    if (parseResult.success) {
                        yield yield __await({ data: parseResult.data, headers: headerRow });
                    }
                    else {
                        const message = `Validation failed on row ${rowNumber}.`;
                        yield yield __await(new CSVParseError(message, rowNumber, line, parseResult.error));
                    }
                }
                else {
                    yield yield __await(values);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = rl_1.return)) yield __await(_b.call(rl_1));
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
