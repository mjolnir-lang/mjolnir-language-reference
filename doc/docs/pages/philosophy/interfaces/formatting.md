# Format

A Format is a syntactic, semantic, and/or lexical arrangement of data on top of
an encoding. Where an encoding is responsible for the storage of information,
the format is responsible for the arrangement of that data in a meaningful way.

For example, the JSON data format may use any character encoding so long as the
encoding is agreed upon by all entities which generate or parse that data. The
JSON format defines a set of rules by which data is represented within the
encoding of choice. The most common ecoding is UTF-8, but other character
encodings may be used.

## Parsing

Parsing may emit one or more of the following types of information:

- lossy/lossless intermediate representation (efficient or useful representation for processing)
- formatting metadata (line number, column number, text color, optional tokens, etc.)
- native translation (direct to data)
- error messages and diagnostics (syntax errors, encoding errors, etc.)

## Printing

- formatting options
- optional/alternate representations
