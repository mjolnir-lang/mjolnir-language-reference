# String Literals

There are two types of string literals in Mjolnir: raw and interpolated.

String literals are always Unicode and encoded in UTF-8.

Strings of either type may be sequenced after one another to perform concatenation. This allows
long strings to be broken up over multiple lines.

## Interpolated String Literals

Interpolated string literals are simply referred to as strings or as string literals. They are the
primary representation of string data.

## Raw String Literals

Raw string literals are delimited by the single quote character, `'`, and do not support escape
sequences. Instead of using escape sequences to contain special characters or literal byte values,
they are intended to contain regex patterns.

Raw string literal use the first and last single quote characters in each line to define their
beginning and end. The Zig programming language uses the end of line as the end of its raw string
literals, but this introduces vertical spacing artifacts in code. Instead, Mjolnir uses a greedy
approach to allow code to be written after the end of the raw string literal which allows for
every benefit of Zig while avoiding the vertical space issue.

### Advantages

- No escape sequences (all characters are literal)
- Simple delimiter
- Supports nested raw string literals
- Visible trailing whitespace

### Disadvantages

- Only one per line

## String Escapes and Interpolation Rationale

This language deliberately keeps string semantics simple, explicit, and type-directed.

### Raw vs interpreted strings

- **Unquoted strings are raw**

  They are byte-for-byte literals with no escape processing or interpolation.
- **Quoted strings are interpreted**

  Escape sequences and interpolation are only processed inside string literals.

This mirrors the core rule: text is only interpreted when explicitly marked as a string literal.

### Expression interpolation

- Interpolation uses parentheses:

  ```mj
  "\(expr)"
  ```

- Parentheses are used because they unambiguously denote expressions, not blocks or statements.
- The interpolated value must already be a valid expression; there is no formatting sublanguage.

Interpolation is equivalent to explicitly converting an expression to a string:

```mj
"\(expr)" // is equivalent to `StringView(expr)`
```

### No formatting mini-language

Mjolnir does not provide a formatting DSL (e.g. `{:.2f}`, `%08x`) for string expressions.

The use of formatting strings in various languages has limited and unintuitive use for non-numeric
types. It usually requires special boilerplate functions for user defined types, and doesn't add
any scalable language feature. They are generally not composable for structured or generic types.
They duplicate logic. They make compile time optimization and static analysis harder.

Formatting is handled explicitly via normal functions and methods:

```mj
"\(12.445.scientific(precision=4, nan="NaN").left_justify(8))"
```

This keeps formatting:

- type-safe
- discoverable
- statically checkable
- extensible to all types

### Design principles upheld

- No hidden interpretation
- No secondary grammars inside strings
- No implicit formatting rules
- Clear separation between raw text and evaluated expressions

In short:

Strings do not format values. Code does.
