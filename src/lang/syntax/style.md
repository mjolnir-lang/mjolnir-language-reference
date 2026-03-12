# Mjolnir Code Style

## Identifier Naming Conventions

### Types

Types are nominally `UpperCamelCase` They are not read as often as variables
and must be distinguished from values. Since types are not named as
specifically as variables, the use of CamelCase is not as limiting.

### Keywords

Keywords are always one word, lowercase. This is common in most languages.
They share style with variables and functions, but they may be used as
keywords with proper semantic formatting.

### Variables and Functions

Functions, methods, member functions, properties, variables,
members, fields, attributes, etc. are `lower_snake_case`.

These are specific and repeated most often. They make up the greatest
percentage of read symbols, so they must be the easiest to read.

### Named Values/Constants

Named values, or constants, are distinct because they are managed differently
as resources.

In this list are local and global variables and enums.

Some variables have a case for being `UPPER_SNAKE_CASE`, such as register fields
and named bitfields.

These identifiers as a subset of variables, so they must be easy to read as well,
and the correlation between upper and lower case is convenient and expressive.

## Layout

## Indentation

Indents should be 4 spaces.

Tab characters are not used because

- They are configurable between editors and result in an inconsistent visual representation and may affect intentional vertical alignment
- They cause problems when not used strictly at the beginning of a line

Using 4 spaces goes hand in hand with the documentation comment of three forward slashes
and a space `/// `. This allows indentation within code blocks inside of documentation comments
to be properly aligned.

| Width | Comment |
| --- | --- |
| 2 | popular, but not distinct enough, encourages deep nesting |
| 3 | Not a power of 2, not very common |
| 4 | Most popular, visually distinct, discourages deep nesting |
| 8 | discourages even shallow nesting |

## Newline line breaks

The newline character for source files is `\n`.

## Whitespace

Because the syntax is semantic, whitespace often required for token parsing.

One of the most common style inconsistencies is the use or lack thereof of whitespace between tokens.

This problem has led to significant customization in code formatters just for whitespace configuration.

The configuration of line breaks and braces is also a contentious style choice. We do not put opening
braces on their own line. It breaks the visual union of a continuation from its parent. Since indentation
is used consistently to track a continuation, the opening brace on the same indent level would be a
violation of that pattern.

## Comments

Block comments use three forward slashes (`///`). When followed by text, a space is required after
the slashes, making the prefix four characters wide — consistent with the language's tab width. This
alignment aids formatting of code blocks and nested lists.

While comments are important for documentation and design rationale, they should not duplicate
information already clear from the code. Comments should explain *why* code exists or is structured
a certain way, not *what* it does when that is self-evident. If a block of code requires a comment
to explain a high-level operation, that may be a signal to extract it into a named function. If the
purpose of a section is not clear, a comment should provide context.

Commenting out code is useful during development and debugging but can become a code smell when the
reason is unclear or forgotten.
