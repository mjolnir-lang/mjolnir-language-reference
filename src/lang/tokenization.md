# Tokenization

The Mjolnir language syntax and semantics are designed to be simple and
expressive, regardless of context.

## Style is Syntactic

Most programming languages use the same character set for all identifiers.
These being `[A-Za-z0-9_]` with the exception that identifiers may not begin with a number in order
to differentiate them from actual numeric literals.

This gives freedom to the programmer to choose whatever style they prefer in most languages,
leading to style wars and standardization of conventions per project, library, company, or organization.

Ultimately code can look very different depending on the author and this leads to increased mental effort to
read or write in ever changing styles and conventions.

This does not only disrupt the programmer's ability to quickly glance over code, but also wastes the
potential for semantic meaning when there is no common rule for distinguishing types from variables and constants.

The Mjolnir language addresses this prevalent issue by encoding syntactic meaning in style.

In addition to programmer quality of life, this greatly simplifies the parsing and lexing stages of the language
analysis tools. It allows colorization of individual tokens with nearly no context.

It also removes the issues related to most vexing parsing. Function declarations no longer can be mistaken for
variable initialization, and template parameter/argument lists cannot be mistaken for relational operators.

In an effort to improve the readability of code and adhere to existing good style, the following rules are
defined:

## Identifiers

Identifiers are generally split into two or three categories for typed languages, three in Mjolnir's case.

### Constants

Constant values are written in `UPPER_SNAKE_CASE`. They may contain only uppercase letters, numbers, and the underscore character.

> **Rationale:** Constants are used infrequently and it is well-established practice in many languages to use `UPPER_SNAKE_CASE` for constant values.

### Variables, Functions, Methods, and Properties

Variables and functions are written in `lower_snake_case`. They may contain only lowercase letters, numbers, and the underscore character. It is considered good practice to separate words and acronyms with a single underscore and to not begin or end the identifier with one or more underscores.

> **Rationale:** Variables and functions are make up the majority of expressions and written code. `lower_snake_case` is by far the most easy to read.

> **Note:** Functions, methods, and properties should have distinct syntax coloring from variables, constants, and types. They are recommended to be colors the same as operators.

### Language Literals

`true`, `false`, `null`

### Numeric Literals

Numeric literals are written in three decimal, hexadecimal, octal, and binary. They may be integers, floating point, or exact decimals.

The `+` and `-` prefixes when applied to a numeric literal are not unary operators.
They are part of the numeric literal token and are not affected by operator precedence rules.

This solves issues related to declaring a minimum signed integer literal. In most programming languages,
there is no negative integer literal, so the negation operator is applied to a positive integer. This
restriction in conjunction with the 2's compliment representation of integers means that negative max int is an invalid value
and must be composed of `-I32_MAX - 1`. Since the magnitude of the minimum value is one more than its maximum value.

The other issue is related to unexpected operator precedence rules. Some languages allow methods to be called on integer literals, but method calls and some other operators have higher precedence than the unary negation operator and result in
unexpected results. `-3.to_string()` would generally result in `-"3"` instead if `"-3"`. The work around for those languages
is to use parenthesis to avoid operator precedence rules: `(-3).to_string()` results in `"-3"`.

This is not a problem for Mjolnir. Instead, to perform unary negation on an integer literal simply apply the same workaround.
`-(1u)` becomes `0xFFFFFFFFu` whereas `-1u` would be a compiler error.

Another benefit to negative integer literals is the additional bounds checking provided by the compiler. Instead of blindly performing negation on a signed or unsigned integer literal which may overflow in unexpected ways, the compiler can emit warnings if the negative integer is out of range for the literal type.

`-128i8` is not an error while in C++ `-I32_MIN` would result in `1` because it is out of range.

### String Literals

#### Character Escape Sequences

Character escape sequences are used to encode special characters within string literals. Although a string literal
is one token, highlighting rules should be used to highlight character escape sequences withing string literals.

These should be grouped with constants.

### Keywords

Keywords are written in `lowercase`. They are reserved for special use by the language to either define types or control the flow of execution.

Unlike most languages, keywords in Mjolnir only have special meaning in certain contexts and are free to be used as variable or function names.

| Keywords | Syntax Rule |
| -------- | ----------- |
| `bitfield` `enum` `impl` `type` `variant` `where` | Keyword followed by a template argument list: `bitfield<u32>` |
| `class` `else` `embed` `interface` `struct` `type` `union` | Followed by an open curly brace or an identifier |
| `asm` `catch` `do` `try` | Followed by an open curly brace |
| `catch` `for` `if` `match` `try` `until` `while` | Followed by a space and an open parenthesis |
| `as` `break` `continue` `fail` `in` `is` `return` `yield` | Always a keyword |

Keyword binary operators have the risk of being interpreted as unit expressions when used following integer literals.
(`as`, `in`, `is`), `as` and `is` are used for dynamic type checking and are low risk, but `in` will cause problems in for
loops. Maybe replace it with `:` like in C++. It does seem out of place, and can be miss used as either a loop expression
or a boolean test for collections. binary keyword operators are a bad idea.

```mj
"\\b(?:bitfield|enum|impl|type|variant|where)(?=<)",

"\\b(?:class|else|embed|interface|struct|type|union)(?=\\s+[{A-Za-z0-9_])",

"\\b(asm|catch|do|try)(?=\\s+{)",

"\\b(catch|for|if|match|try|until|while)(?=\\s+\\()",

"\\b(as|break|continue|fail|in|is|return|yield)\\b",
```

### User Defined Types (Composite Types)

Types are written in `PascalCase` (or its alias `UpperCamelCase`) They may contain mixed case letters, numbers, hyphens, periods/decimal characters, but they may not contain an underscore character, They must contain both upper and lower case letters to distinguish them from constants and variables.

Single uppercase letter identifiers are considered types and not constants, given their common use as template or generic type names.

Type names must begin with an uppercase letter or a number. They may not begin with a punctuation symbol or a lowercase letter.

The only standard casing style not used by Mjolnir is `camelCase`, which is not visually distinctive enough to warrant inherent syntactic meaning.

> **Rationale:** Types must be easily distinguishable from variables and expressions. Using `PascalCase` for types is a well-established practice in many languages.

### Fundamental Types

Mjolnir defines several fundamental types which use special casing rules to distinguish them from their composite counterparts.

The types: `u8`, `u16`, `u32`, `u64`, `u128`, `i8`, `i16`, `i32`, `i64`, `i128`, `f16`, `f32`, `f64`, `f80`, `f128`, `bool`, and `void` use all lowercase and would normally be considered variable or function names.

> **Note:** `void` is considered a type in Mjolnir and not a keyword. Although it is used with special meaning in three places, all three are places where type expressions would be used and grouping it with the rest of the fundamental types would allow it to receive the same syntax coloring.

As an aside there are no `size_t` type, `intptr_t` or `char` types. The reason being that size type is used to indicate machine word size which is not meaningful, integer representations of pointers can be performed directly on the `void *` type, and the use of Unicode as the character encoding and lack of an actual character literal renders a dedicated character type meaningless.

> **Rationale:** Fundamental types must be easily distinguishable user defined types and variables. This is difficult to do, but using `lowercase` for fundamental types is a well-established practice in many languages and syntax highlighting reduces most of the cognitive burden.

### Modules

Modules (or libraries) are used in import statements and to provide precise scoping for types and variables within code.

Mjolnir makes descriptive naming a priority when it comes to modules and libraries. Allowing the most freedom to programmers
is a driving factor to improving the ergonomics of the developer experience.

Because the usage of module identifiers is always followed by the scope resolution operator `::`, any combination of characters may be used `[A-Za-z0-9.+-]`, and there is no enforced casing rule.

The following are all valid module names.

`1-Wire::`
`Cortex-M0+::`
`I2C::`
`zlib::`
`Ethernet::`

### Units

Units of measure are special.

### Recommended Practices

It is common in other programming languages to use leading or trailing
underscores to indicate either language specific, compiler specific, or member
variables or functions. Those practices are not necessary in Mjolnir, and in
the case with member variable designation, Mjolnir separates the namespaces of
variables and functions to so that the most appropriate name can be used in
every context.

## Punctuation

There are 4 categories of punctuation in Mjolnir

Separators, operators, type specifiers, and unit expression operators.

Many symbols belong to more than one category

### Operators

### Named Operators

`sizeof()`, `typeof()`, `alignof()`, `offsetof()`, ``

### Comments

```mj
```

### Spacing and Indentation

Indentation is used as a hint to he parser, and spacing is required or prohibited when creating expressions with
binary operators and such. Newlines are used to terminate statements instead of semicolons, but semicolons are still used
to separate statements on the same line.
