# String Expressions

String expressions are zero cost abstractions over a sequence of write calls.

The literal portions are always Unicode and encoded in UTF-8. The sub expressions are expected to also
produce valid UTF-8 data.

String expressions and string literals may be sequenced after one another to perform concatenation.
This allows long strings to be broken up over multiple lines, without inserting newline characters.
The result will be a string expression if any component is a string expression.

## Interpolated String Literals

Interpolated string literals are simply referred to as strings or as string literals. They are the
primary representation of string data.

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
