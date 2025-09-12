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
Object.defineProperty(exports, "__esModule", { value: true });
const basic_parser_1 = require("./basic-parser");
/*
  Example of how to run the parser outside of a test suite.
*/
const DATA_FILE = "./data/people.csv"; // update with your actual file name
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Because the parseCSV function needs to "await" data, we need to do the same here.
        const results = yield (0, basic_parser_1.parseCSV)(DATA_FILE);
        // Notice the difference between "of" and "in". One iterates over the entries, 
        // another iterates over the indexes only.
        for (const record of results)
            console.log(record);
        for (const record in results)
            console.log(record);
    });
}
main();
