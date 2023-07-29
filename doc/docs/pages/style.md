# Mjolnir Code Style

## Naming Conventions

### Types

Types are `UpperCamelCase` They are not read as often as variables
and must be distinguished from values. Since types are not named as
specifically as variables, the use of CammelCase is not as limiting.

### Keywords

Keywords are always one word, lowercase. This is common in mose languages.
They share style with variables and functions, but they may be used as
keywords with propper semantic formatting.

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
and named bitfieds.

These identifiers as a subset of variables, so they must be easy to read as well,
and the correlation between upper and lower case is convenient and expressive.

## Layout

## Whitespace and newlines

Indents should be 4 spaces, not tabs

Tabs are configurable between text processors, but only when used between the
beginning of the line and the first non-whitespace character.

Otherwise formatting and alignment is not preserved by changing the tab size.

Using 4 spaces goes hand in hand with the documentation comment of three forward slashes
and a space. This allows indentation within code blocks inside of documentation comments
to be properly aligned.

Indentation is often one of several common sizes:

- 1 - Not distinct enough, unusable
- 2 - popular, but not distinct enough, encourages deep nesting
- 3 - Not a power of 2, not very common
- 4 - Good, popular, distinct, discourages deep nesting
- 6 - non-standard
- 8 - Absurdly large

## Comments

## Braces and Scopes
