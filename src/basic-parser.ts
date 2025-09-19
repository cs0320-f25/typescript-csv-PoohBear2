import * as fs from "fs";
import * as readline from "readline";
import { z, ZodError } from "zod";

/**
 * A custom error class for CSV parsing issues. It bundles detailed
 * context to help developers debug invalid rows.
 */
export class CSVParseError extends Error {
  public readonly rowNumber: number;
  public readonly rawLine: string;
  public readonly zodError: ZodError;

  constructor(
    message: string,
    rowNumber: number,
    rawLine: string,
    zodError: ZodError
  ) {
    super(message);
    // Set the name for easy identification, e.g., `if (e instanceof CSVParseError)`
    this.name = "CSVParseError"; 
    this.rowNumber = rowNumber;
    this.rawLine = rawLine;
    this.zodError = zodError;
  }
}

/**
 * Defines the structure for a single successfully-parsed record,
 * which includes the typed data row and an optional array of header strings.
 */
export type ParsedRecord<T> = {
  data: T;
  headers?: string[];
};

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
export async function* parseCSV<T>(
  path: string,
  schema?: z.ZodType<T>,
  hasHeader: boolean = false
): AsyncGenerator<ParsedRecord<T> | string[] | CSVParseError> {
  const fileStream = fs.createReadStream(path);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let headerRow: string[] | undefined = undefined;
  let rowNumber = 0;
  let isFirstRow = true;

  for await (const line of rl) {
    rowNumber++;
    if (line.trim().length === 0) continue;

    // --- MODIFICATION START ---
    // Replaced `line.split(',')` with a robust regex-based parser to correctly handle
    // fields enclosed in double quotes, allowing them to contain commas.
    const fields: string[] = [];
    const regex = /(?:"((?:[^"]|"")*)"|([^,]*))(?:,|$)/g;
    let match: RegExpExecArray | null;

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
      const value =
        quotedContent !== undefined
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
        yield { data: parseResult.data, headers: headerRow };
      } else {
        const message = `Validation failed on row ${rowNumber}.`;
        yield new CSVParseError(message, rowNumber, line, parseResult.error);
      }
    } else {
      yield values;
    }
  }
}