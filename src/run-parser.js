"use strict";
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
const basic_parser_1 = require("./basic-parser");
/*
  Example of how to run the parser outside of a test suite.
*/
const DATA_FILE = "./data/people.csv"; // update with your actual file name
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        // Because the parseCSV function needs to "await" data, we need to do the same here.
        const results = yield (0, basic_parser_1.parseCSV)(DATA_FILE);
        try {
            // Notice the difference between "of" and "in". One iterates over the entries, 
            // another iterates over the indexes only.
            for (var _d = true, results_1 = __asyncValues(results), results_1_1; results_1_1 = yield results_1.next(), _a = results_1_1.done, !_a; _d = true) {
                _c = results_1_1.value;
                _d = false;
                const record = _c;
                console.log(record);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = results_1.return)) yield _b.call(results_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        for (const record in results)
            console.log(record);
    });
}
main();
