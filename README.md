# Sprint 1: TypeScript CSV

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

   If I were a developer using this CSV parser, it would frustrate me if the parser could only handle data separated exclusively by commas, with no headers, and with a predefined limit of columns of data for each row. I want flexibility, such as being able to process csv files with no data, and a sense of security, such as a checker that ensures the passed data is in a csv format and notifies me when it isn’t. The LLM’s responses using the given prompt overlapped completely with my original ideas. After editing the original prompt so that the LLM could give me more specific edge cases on the types of data in my csv file, I liked one particular suggestion, which was how fields themselves could contain commas, semicolons, or some other delineator, which the CSV should handle as one thing rather than a list of things.

### Design Choices

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
