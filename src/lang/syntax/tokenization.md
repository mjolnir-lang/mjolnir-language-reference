# Mjolnir Language Specification

## Source Files

Source files are UTF-8 encoded. The line ending character is `\n` (LF). CRLF line
endings are not valid. Files end with a single trailing newline.

## Identifiers

An identifier is a sequence of Unicode letters, digits, and underscores that does not
begin with a digit. Identifiers are case-sensitive.

Identifiers occupy one of three syntactic roles: type names, which are
`UpperCamelCase`; constant names and enum variants, which are `UPPER_SNAKE_CASE`; and
all other value-level names — variables, functions, fields, parameters — which are
`lower_snake_case`. These conventions are enforced by the compiler. An identifier in
the wrong form for its declared role is a compile error.

## Keywords

Keywords are reserved identifiers. Most keywords are context-sensitive: whether a
given token is treated as a keyword depends on its syntactic position. The tables
below describe the conditions under which each identifier is reserved and the positions
where it may safely be used as an ordinary identifier.

The columns **Variable**, **Function**, and **Generic** indicate whether the identifier
may be used in that role without ambiguity. A `-` means the identifier is never valid
in that role. `safe` means it is valid in that role subject to the keyword condition
being absent.

### Built-in Type Names

Built-in type names are pure keywords. They may not be used as identifiers in any
position.

- `void`
- `bool`
- `n8`, `n16`, `n32`, `n64`, `n128`
- `i8`, `i16`, `i32`, `i64`, `i128`
- `f16`, `f32`, `f64`
- `nat`, `nat2`, `nat4`, `nat8`
- `int`, `int2`, `int4`, `int8`

### Pure Keywords

These identifiers are always keywords and may not be used as identifiers in any
position.

| Token    | Variable | Function | Generic |
| -------- | -------- | -------- | ------- |
| `struct` | -        | -        | -       |
| `union`  | -        | -        | -       |

### Non-variable Keywords

These keywords may be used as function or generic names but not as variable names.

| Token           | Variable | Function | Generic |
| --------------- | -------- | -------- | ------- |
| `and`           | -        | safe     | safe    |
| `break`         | -        | safe     | safe    |
| `case`          | -        | safe     | safe    |
| `catch`         | -        | safe     | safe    |
| `continue`      | -        | safe     | safe    |
| `else`          | -        | safe     | safe    |
| `fail`          | -        | safe     | safe    |
| `false`         | -        | safe     | safe    |
| `not`           | -        | safe     | safe    |
| `or`            | -        | safe     | safe    |
| `return`        | -        | safe     | safe    |
| `then`          | -        | safe     | safe    |
| `true`          | -        | safe     | safe    |
| `uninitialized` | -        | safe     | safe    |
| `yield`         | -        | safe     | safe    |
| `null`          | -        | safe     | safe    |

The keywords `and`, `or`, `then`, `else`, `case`, and `catch` are inline structural
operators. They cannot be variable names because they are recognized as keywords when
followed by an expression boundary — the point at which the next token cannot
continue the current expression or begins a new one.

Variable declarations require the ability to be followed by `{` to satisfy inline
initialization syntax: `TypeName var_name { ... }`. The keywords `do`, `struct`,
`try`, and `union` would otherwise be valid variable names but are excluded by this
rule.

### Non-function, Non-generic Keywords

`new` is used for destination-inferred constructor calls and may carry generic
parameters. It may be used as a variable name but not as a function or generic name.

| Token | Variable | Function | Generic |
| ----- | -------- | -------- | ------- |
| `new` | safe     | -        | -       |

```mj
Array<nat> data = new(10)
```

### Non-generic Keywords

These keywords may be used as variable or function names but not as generic names.
They are recognized as keywords when followed by `<`.

| Token      | Variable | Function | Generic | Keyword suffix |
| ---------- | -------- | -------- | ------- | -------------- |
| `asm`      | safe     | safe     | -       | `<`            |
| `bitfield` | safe     | safe     | -       | `<`            |
| `impl`     | safe     | safe     | -       | `<`            |
| `enum`     | safe     | safe     | -       | `<`, type name |

### Conditional Keywords

These identifiers are keywords only when followed by a specific suffix token or token
class. In all other positions they are valid identifiers.

Type qualifiers are only keywords when used in a type expression or as a method self
qualifier. `as` and `is` are keywords only when followed by a type name or type
qualifier. `if`, `match`, `try`, `until`, `use`, and `while` are keywords only when followed
by an expression boundary.

| Token       | Variable | Function | Generic | Keyword suffix                     |
| ----------- | -------- | -------- | ------- | ---------------------------------- |
| `as`        | safe     | safe     | safe    | type name/qualifier                |
| `is`        | safe     | safe     | safe    | type name/qualifier                |
| `for`       | safe     | safe     | safe    | type name/qualifier, variable name |
| `class`     | safe     | safe     | safe    | type name                          |
| `interface` | safe     | safe     | safe    | type name                          |
| `const`     | safe     | safe     | safe    | type name                          |
| `safe`      | safe     | safe     | safe    | type name                          |
| `type`      | safe     | safe     | safe    | type name                          |
| `unit`      | safe     | safe     | safe    | unit name                          |
| `import`    | safe     | safe     | safe    | module name                        |
| `do`        | safe     | safe     | safe    | `{`                                |
| `if`        | safe     | safe     | safe    | expression boundary                |
| `match`     | safe     | safe     | safe    | expression boundary                |
| `try`       | safe     | safe     | safe    | expression boundary                |
| `until`     | safe     | safe     | safe    | expression boundary                |
| `use`       | safe     | safe     | safe    | expression boundary                |
| `while`     | safe     | safe     | safe    | expression boundary                |

Keywords whose conditional suffix is `expression boundary` may be used as variable names with one
restriction: they may not appear in the inline instance declaration form
`TypeName keyword_var { ... }`. This form is syntactically ambiguous for keyword
identifiers because the lexer cannot distinguish the variable name from the keyword
without unbounded lookbehind through a potentially generic type name. The explicit instance
declaration form must be used instead:

```mj
struct Match {
    String text
    nat offset
}

Match match
```

instead of the inline instance form:

```mj
struct Match match {
    String text
    nat offset
}
```

This is the only place in the language where a non-expression boundary is not trivially
distinguishable from an expression boundary.

`match` and `type` are the primary identifiers this restriction is intended to
preserve. Their keyword conditions are forward-looking and do not collide with `{`
expressions in ordinary statement positions — only in the inline instance declaration
form.

#### Expression Boundaries

An expression boundary is a position in the token stream where a new independent value
is introduced. It is the point at which the next token begins a value rather than
continuing, connecting, or operating on an existing one.

A token marks an expression boundary if it is a literal, an identifier in value
position, or an opening delimiter — optionally preceded by one or more prefix
operators. Prefix operators do not themselves constitute the boundary; they are part of
the expression they introduce and are transparent to boundary detection.

Tokens that connect or branch between expressions — structural operators, type
operators, and similar connectives — do not mark an expression boundary regardless of
their position. The parser resolves any specific token to one side or the other of this
line based on context.

Expression boundaries are used by the keyword system to determine when context-sensitive
keywords are active. A keyword that is only recognized when followed by an expression
boundary is never active when the following token is a connective, ensuring the
identifier remains available in positions where a new value is not being introduced.

The precise syntactic detection of expression boundaries, including the handling of
edge cases in the keyword system, is specified in the lexer document, but correct syntax
will never violate the rule, so this shouldn't be a concern for developers.

### Unconditional Safe Keywords

`in` is only syntactically meaningful inside a for-loop, but it is a valid identifier
in all positions including as the iteration variable itself.

| Token | Variable | Function | Generic |
| ----- | -------- | -------- | ------- |
| `in`  | safe     | safe     | safe    |

```mj
for in in in {
    print(in)
}
```

## Tokens and Whitespace

Whitespace in Mjolnir is semantic. Whitespace is implicitly present between every pair
of adjacent tokens. Each token independently declares whether it consumes that
whitespace on its left side, its right side, both sides, or neither. Tokens that share
the same source text but differ in their consumption declaration are distinct tokens
with distinct meanings.

At any boundary between two tokens, each token's consumption declaration is evaluated
independently. If the left token consumes on its right, the whitespace between them is
consumed from the right. If the right token consumes on its left, it is consumed from
the left. Either side consuming is sufficient — both consuming is also valid, as in
chained prefix operators such as `-*ptr`, where `-` consumes on its right and `*`
consumes on its right, leaving no space between them. Space is only present at a
boundary when neither adjacent token consumes it.

The formatter enforces canonical whitespace by deriving it from each token's
consumption declaration. There is exactly one valid whitespace form for any given
token sequence.

The four consumption categories are:

- **Non-consuming** — does not consume whitespace on either side
- **All-consuming** — consumes whitespace on both sides
- **Left-consuming** — consumes whitespace on the left side only
- **Right-consuming** — consumes whitespace on the right side only

Comments are the only tokens that can override the consumption declaration of an
adjacent token. A comment overrides the right-side consumption of any preceding token
on the same line, restoring the implicit whitespace before the `//` regardless of what
precedes it.

### Non-consuming Tokens

Space is required on both sides.

| Token | Description |
| --- | --- |
| `+`, `-`, `*`, `/`, `%`, `&`, `\|`, `^`, `<<`, `>>` | Infix arithmetic and bitwise operators |
| `=`, `+=`, `-=`, `*=`, `/=`, `%=`, `&=`, `\|=`, `^=`, `<<=`, `>>=` | Assignment operators |
| `<=>`, `==`, `!=`, `<`, `>`, `<=`, `>=` | Comparison operators |
| `=>` | Pattern match arrow |
| `"`, `'` | String delimiters |
| `const`, `safe` | Type access qualifiers |
| `false`, `null`, `true`, `uninitialized` | Constant literals |
| Type names | `UpperCamelCase` identifiers |
| Variable names | `lower_snake_case` identifiers |
| Keywords | All keyword tokens not listed elsewhere |
| Comments | `//` and `///` — also override preceding token's right consumption |

### All-consuming Tokens

No space on either side.

| Token | Description |
| --- | --- |
| `<`, `>` | Angle bracket delimiters (generic and comparison contexts) |
| String literal content | Characters between string delimiters |
| `::` | Member scope accessor (following an identifier) |
| `.` | Member accessor (following an identifier) |
| `[` | Subscript operator (following an expression) |
| `:` | Slice operator (inside a subscript expression) |

### Left-consuming Tokens

No space on the left, space on the right.

| Token | Description |
| --- | --- |
| `)`, `}`, `]` | Closing delimiters |
| `,`, `;` | Separators |
| `:` | Key-value separator (outside a subscript expression) |
| `&`, `++`, `--` | Suffix operators |
| `&`, `*`, `^` | Type operators |
| `?`, `!` | Type initialization qualifiers |
| `'`, `"` | Lifetime qualifiers |

### Right-consuming Tokens

Space on the left, no space on the right.

| Token | Description |
| --- | --- |
| `(`, `{` | Opening delimiters |
| `[` | Array literal delimiter (not following an expression) |
| `::` | Global scope accessor (not following an identifier) |
| `.` | Self instance accessor (not following an identifier) |
| `&`, `~`, `-`, `*`, `++`, `--` | Prefix operators |
| Function names | `lower_snake_case` identifiers in call position |

## Line Continuation

A line whose indentation level is greater than the preceding statement line is a
continuation of that statement. Continuation lines remain at the increased indentation
level until the statement ends. Operators and conjunctions that span a line break
appear at the start of the continuation line, not the end of the preceding line.

A line that returns to or below the indentation level of the opening line ends the
continuation.

## Comments

Line comments begin with `//` and extend to the end of the line. Documentation
comments begin with `///`. Both forms consume the remainder of the line and override
the right-side whitespace consumption of any preceding token on the same line.

A comment appearing after code on the same line must be preceded by at least one
space. This satisfies the non-consuming rule for the comment token itself.

Block comments are not supported. Multi-line commentary uses consecutive line
comments.
