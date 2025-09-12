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
exports.parseCSV = parseCSV;
const fs = __importStar(require("fs"));
const readline = __importStar(require("readline"));
/**
 * This is a JSDoc comment. Similar to JavaDoc, it documents a public-facing
 * function for others to use. Most modern editors will show the comment when
 * mousing over this function name. Try it in run-parser.ts!
 *
 * File I/O in TypeScript is "asynchronous", meaning that we can't just
 * read the file and return its contents. You'll learn more about this
 * in class. For now, just leave the "async" and "await" where they are.
 * You shouldn't need to alter them.
 *
 * @param path The path to the file being loaded.
 * @returns a "promise" to produce a 2-d array of cell values
 */
function parseCSV(path, schema) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c, _d, e_2, _e, _f;
        // This initial block of code reads from a file in Node.js. The "rl"
        // value can be iterated over in a "for" loop. 
        const fileStream = fs.createReadStream(path);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity, // handle different line endings
        });
        // Create an empty array to hold the results
        let result = [];
        let row = 0;
        // We add the "await" here because file I/O is asynchronous. 
        // We need to force TypeScript to _wait_ for a row before moving on. 
        // More on this in class soon!
        //If a shcema is provided, process rows into a typed array, with the type being the zod type the user gave us
        if (schema) {
            const result = [];
            let rowNumber = 0;
            try {
                for (var _g = true, rl_1 = __asyncValues(rl), rl_1_1; rl_1_1 = yield rl_1.next(), _a = rl_1_1.done, !_a; _g = true) {
                    _c = rl_1_1.value;
                    _g = false;
                    const line = _c;
                    rowNumber++;
                    //if line is empty, skip it
                    if (line.trim().length === 0)
                        continue;
                    const values = line.split(",").map((v) => v.trim());
                    const parseResult = schema.safeParse(values);
                    if (parseResult.success) {
                        // If parsing was successful, add the data to the result array
                        result.push(parseResult.data);
                    }
                    else {
                        // If parsing failed, close the readline interface and throw an error describing what the error was and on which row it happened on
                        rl.close();
                        throw new Error(`Validation failed on row ${rowNumber}: ${parseResult.error.message}`);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_g && !_a && (_b = rl_1.return)) yield _b.call(rl_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return result;
        }
        else {
            //If no schema is provided, just return a 2d array of strings (original behavior)
            const result = [];
            try {
                for (var _h = true, rl_2 = __asyncValues(rl), rl_2_1; rl_2_1 = yield rl_2.next(), _d = rl_2_1.done, !_d; _h = true) {
                    _f = rl_2_1.value;
                    _h = false;
                    const line = _f;
                    //if line is empty, skip it
                    if (line.trim().length === 0)
                        continue;
                    const values = line.split(",").map((v) => v.trim());
                    result.push(values);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_h && !_d && (_e = rl_2.return)) yield _e.call(rl_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return result;
        }
    });
}
