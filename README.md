# Sprint 1: TypeScript CSV

### LINK TO REPO: https://github.com/cs0320-f25/typescript-csv-PoohBear2

### Task C: Proposing Enhancement

- #### Step 1: Brainstorm on your own.

  1. should be able to handle various delimiters (not just , seperated values)
  2. should handle empty csv's
  3. should error back to me if format of csv is invalid/is not a csv file
  4. should be able to handle a csv with an arbitary number of rows and columns

- #### Step 2: Use an LLM to help expand your perspective.

  1. Modified Prompt 1: “I’m working on a CSV parser in TypeScript that currently accepts a filename as input and converts rows into strings or objects. What are some missing features or edge cases that I should consider? What improvements would make it easier for other developers to use in different kinds of apps? Ensure that the csv parser returns output that is comprehensible and applicable to all potential csv inputs”
  2. Modified Prompt 2: “I’m developing a CSV parser in TypeScript that currently accepts a filename as input and converts rows into strings or objects. I’d like feedback on potential missing features, edge cases, and improvements. Specifically, what parsing behaviors, configuration options, and error-handling strategies should I consider to ensure the parser is robust against real-world CSV variations (e.g., quoted fields, escape sequences, multiline values, inconsistent column counts, different delimiters, or encoding issues)?


- #### Step 3: use an LLM to help expand your perspective.

    Include a list of the top 4 enhancements or edge cases you think are most valuable to explore in the next week’s sprint. Label them clearly by category (extensibility vs. functionality), and include whether they came from you, the LLM, or both. Describe these using the User Story format—see below for a definition.

  1. Header Processing
Category: Extensibility
Origin: My idea, refined by LLM.
User Story: As a user, I can specify that the first row of a CSV is a header so that the parser returns an array of structured objects, with each object's keys corresponding to the header names.
Acceptance Criteria:
When the header option is enabled, the function returns an array of objects.
Each object's keys must match the corresponding column names from the header row.
Data rows with fewer columns than the header should result in objects with missing keys for the empty columns.

2. Correctly Parse Quoted Fields
Category: Functionality
Origin: from LLM
User Story: As a user, I can parse a CSV where fields containing commas are correctly handled when enclosed in double quotes so that the data's integrity is maintained according to the specification.
Acceptance Criteria:
A row such as: I, Like, “Providence, RI” must be parsed into exactly three fields.
The third field in the result must be the string “Providence, RI” without the enclosing quotes.

3. Column Consistency Across All Rows
Category: Extensibility
Origin: My idea, refined by LLM.
User Story: As a user, I expect the parser to validate that there is a consistent number of columns across all rows so that I can be confident in the structure of the parsed data without writing my own validation checks.
Acceptance Criteria:
The parser determines the expected column count from the first row of the file.
If any subsequent row has a different number of columns, the parser must communicate an error back to the caller.
On a successful parse, every array inside the returned 2D array must have the same length.

4. Support for Custom Delimiters
Category: Extensibility
Origin: My idea, user by LLM.
User Story: As a developer, I can optionally provide a delimiter character when invoking the parser so that I can process files that are not comma-separated, but instead semicolon-separated (for instance). 
Acceptance Criteria:
The function accepts an optional configuration parameter for the delimiter.
When a delimiter (e.g., ;) is provided, it is used to split the fields in each row.
If no delimiter is provided, the parser defaults to using a comma.


    Include your notes from above: what were your initial ideas, what did the LLM suggest, and how did the results differ by prompt? What resonated with you, and what didn’t? (3-5 sentences.)

### Design Choices
   If I were a developer using this CSV parser, it would frustrate me if the parser could only handle data separated exclusively by commas, with no headers, and with a predefined limit of columns of data for each row. I want flexibility, such as being able to process csv files with no data, and a sense of security, such as a checker that ensures the passed data is in a csv format and notifies me when it isn’t. The LLM’s responses using the given prompt overlapped completely with my original ideas. After editing the original prompt so that the LLM could give me more specific edge cases on the types of data in my csv file, I liked one particular suggestion, which was how fields themselves could contain commas, semicolons, or some other delineator, which the CSV should handle as one thing rather than a list of things.


### 1340 Supplement

- #### 1. Correctness

- #### 2. Random, On-Demand Generation

- #### 3. Overall experience, Bugs encountered and resolved
#### Errors/Bugs:
#### Tests:
#### How To…

#### Team members and contributions (include cs logins):

#### Collaborators (cslogins of anyone you worked with on this project and/or generative AI):
#### Total estimated time it took to complete project:
#### Link to GitHub Repo:  


#Spring 2
# Sprint 2: Extensible CSV

User Story 1

How do you evaluate correctness when you don’t understand the artifact fully? What do you believe you understand (or not)?

My approach is to trust the test suite as the source of truth for the desired behavior. I don't need to comprehend the intricate logic of why a regex works, but rather, I systematically observe that it works by comparing its output against a comprehensive set of test cases covering both common scenarios and critical edge cases. I believe I understand the functional requirements (handling quoted commas, escaped quotes, and empty fields) because the tests define them explicitly. What I don't understand is the original author's design intent or the subtle performance trade-offs between different, but functionally similar, patterns.

Implementation Choice: Between the four regexes we provided and the one generated by the LLM, which do you believe is the best, and therefore have chosen to implement? Why?

Based on the provided test suite, the AI-generated regex is the best choice to implement. It successfully passes all the critical tests that the simpler expressions fail, such as correctly handling fields with commas, escaped quotes, and empty fields. Regex4 fails messily on malformed data and handles whitespace poorly. 


### User Story 2

- #### Propose two (2) different strategies for choosing keys when there is no header present. Include the pros and cons of each option. 

One strategy is to use zero-based numeric indices for keys, as the first column is always accessible at index 0. The major con is that numeric keys are not descriptive and can lead to "magic numbers" in the code, reducing readability. A second strategy is to generate generic string keys, such as column_1, column_2, etc. However, the keys still lack meaning about the data they represent.


- #### Choose one strategy (out of your two options) and implement it in your parser. Justify your choice in comments or documentation. 

My parser returns a simple array of strings when no schema or header is provided and leaves data interpretation entirely to the caller. This keeps the base parser simple and un-opinionated. Forcing a key structure might conflict with the user's intended use or the structure of their Zod schema. By providing the raw array, the parser gives the developer maximum flexibility to map the data as they see fit.
### User Story 4

Document your choice and justify your reasoning for the information you include and exclude.

The CSVParserError includes the rowNumber and the rawLine so the developer can immediately locate the problematic data in the source file. It also includes the original ZodError object which contains information about why the validation failed. Information like the file path was excluded because the calling function already has that context.

- #### You’re building a developer-facing tool, and your user has provided the schema, so they’re in the best position to fix or handle bad data. But what happens after an error? Should your parser stop immediately when it hits a bad row, or keep going and continue yielding rows even after an error? Document your choice and justify your reasoning. 

The parser is designed to continue processing after encountering an invalid row. Instead of throwing an exception that would halt execution, it yields a CSVParserError object and moves to the next line. This is ideal because it enables batch processing of large files and allows the user to collect all valid rows while simultaneously logging all errors for later review. The user can choose to stop iterating upon receiving an error or handle it and continue, which is really flexible.


### User Story 6

### Reflection

- 1. #### Different user types. Our user stories involved the needs of other developers. How does engineering code for other developers to use (for purposes you don’t know!) change your approach to programming?
Engineering code for other developers shifts the focus from a specific outcome to creating a robust and flexible tool, where including function signatures, configuration options, and return types becomes the most critical part of the design. You must anticipate a wider variety of use cases and provide documentation that points out all the predictable behaviors of your code. The goal is to empower the user by giving them control rather than making decisions on their behalf, such as printing directly to the console or halting the program on an error.

### Design Choices

#### Errors/Bugs:

#### Tests:
#### How To…
#### Team members and contributions (include cs logins):
#### Collaborators (cslogins of anyone you worked with on this project or generative AI):
#### Total estimated time it took to complete project: 10 hours ish
#### Link to GitHub Repo:  https://github.com/cs0320-f25/typescript-csv-PoohBear2




