import * as fs from "fs";
import * as readline from "readline";
import { z } from "zod";
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

export async function parseCSV<T>(
  path: string, 
  schema?: z.ZodType<T>
): Promise<T[] | string[][]> {
  // This initial block of code reads from a file in Node.js. The "rl"
  // value can be iterated over in a "for" loop. 
  const fileStream = fs.createReadStream(path);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity, // handle different line endings
  });
  
  // Create an empty array to hold the results
  let result = []
  let row = 0
  
  // We add the "await" here because file I/O is asynchronous. 
  // We need to force TypeScript to _wait_ for a row before moving on. 
  // More on this in class soon!

  //If a shcema is provided, process rows into a typed array, with the type being the zod type the user gave us
  if (schema) {
    const result: T[] = [];
    let rowNumber = 0;
    for await (const line of rl) {
      rowNumber++;

      //if line is empty, skip it
      if (line.trim().length === 0) continue; 

      const values = line.split(",").map((v) => v.trim());
      const parseResult = schema.safeParse(values);

      if (parseResult.success) {

        // If parsing was successful, add the data to the result array
        result.push(parseResult.data);
      } else {

        // If parsing failed, close the readline interface and throw an error describing what the error was and on which row it happened on
        rl.close();
        throw new Error(
          `Validation failed on row ${rowNumber}: ${parseResult.error.message}`
        );
      }
    }
    return result;
  } else {

    //If no schema is provided, just return a 2d array of strings (original behavior)
    const result: string[][] = [];
    for await (const line of rl) {

      //if line is empty, skip it
      if (line.trim().length === 0) continue; 
      const values = line.split(",").map((v) => v.trim());
      result.push(values);
    }
    return result;
  }
}