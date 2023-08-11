# Mjolnir Syntax

This document is a reference for the syntax and its corresponding rational
for the Mjolnir language.

Syntax is very closely related to program structure and execution.

- [Expressions](#expressions)
  - [Operators](#operators)
  - [Operands](#operands)
- [Types](#types)
  - [Generic Types](#generic-types)
- [Type Qualifiers](#type-qualifiers)
- [Identifiers](#identifiers)
- [Literals](#literals)
- [Primitives](#primitives)
- [Unions](#unions)
- [Enumerations](#enumerations)
- [Structures](#structures)
- [Variants](#variants)
- [Classes](#classes)
  - [Methods](#methods)
  - [Members](#members)
- [Interfaces](#interfaces)
- [Functions](#functions)
- [Scopes](#scopes)

## Expressions

Expressions are sequences of operators and operands, the evaluation of which
represents the program execution.

Expressions are translated into machine code.

As an optimization, expressions will be evaluated at compile time so long as
they are deterministic.

### Operators

Operators are symbolic representations of various operations.

#### Assignment Operators

| Symbol | Name | Description |
| ------ | ---- | ----------- |
| `=`    | Assignment                               | |
| `+=`   | Arithmetic addition and assignment       | |
| `-=`   | Arithmetic subtraction and assignment    | |
| `*=`   | Arithmetic multiplication and assignment | |
| `/=`   | Arithmetic division and assignment       | |
| `%=`   | Arithmetic remainder and assignment      | |
| `&=`   | Bitwise AND and assignment               | |
| `\|=`  | Bitwise OR and assignment                | |
| `^=`   | Bitwise XOR and assignment               | |
| `<<=`  | Logical Shift Left and assignment        | |
| `>>=`  | Logical Shift Right and assignment       | |
| `^>=`  | Arithmetic Shift Right and assignment    | |
| `&=`   | Bitwise AND and assignment               | |
| `\|=`  | Bitwise OR and assignment                | |
| `^=`   | Bitwise XOR and assignment               | |

#### Arithmetic Operators

| Symbol | Name | Description |
| ------ | ---- | ----------- |
| `+`    | Arithmetic addition       | |
| `-`    | Arithmetic subtraction    | |
| `*`    | Arithmetic multiplication | |
| `/`    | Arithmetic division       | |
| `%`    | Arithmetic remainder      | |

#### Logical Operators

| Symbol | Name | Description |
| ------ | ---- | ----------- |
| `!`    | Logical NOT | |
| `&&`   | Logical AND | |
| `\|\|` | Logical OR  | |
| `^^`   | Logical XOR | |

**Note:** Short circuit behavior applies to logical operators `&&` and `||`,
such that as soon as the expression is evaluated.

#### Bitwise Operators

| Symbol | Name | Description |
| ------ | ---- | ----------- |
| `~`    | Bitwise NOT            | |
| `&`    | Bitwise AND            | |
| `\|`   | Bitwise OR             | |
| `^`    | Bitwise XOR            | |
| `<<`   | Logical Shift Left     | |
| `>>`   | Logical Shift Right    | |
| `^>`   | Arithmetic Shift Right | |

#### Relational Operators

| Symbol | Name | Description |
| ------ | ---- | ----------- |
| `==`   | Equal to                 | |
| `!=`   | Not equal to             | |
| `>`    | Greater than             | |
| `<`    | Less than                | |
| `>=`   | Greater than or equal to | |
| `<=`   | Less than or equal to    | |

```mj
// Function call
// ()

// Subscript
// []

// Slice
// [:]
// [::]

// Member access
// .
// ->

// Scope
// ::

// Increment/Decrement
// ++
// --


// Address/Dereference
// &
// *
```

### Operands

Operands are the values consumed by operators in their evaluation.

## Types

Types are akin to metadata used by the compiler to perform transformations on storage.

Storage: size, alignment, constant, volatile, type, access, unique, address, offset

When alignment is artificially increased, the size of the type is as well so as
to preserve alignment in arrays. It would be nice to reclaim those holes.

### Fundamental Types

| Type   | Description |
| ------ | ----------- |
| `u8`   | Unsigned 8 bit integer        |
| `u16`  | Unsigned 16 bit integer       |
| `u32`  | Unsigned 32 bit integer       |
| `u64`  | Unsigned 64 bit integer       |
| `i8`   | Signed 8 bit integer          |
| `i16`  | Signed 16 bit integer         |
| `i32`  | Signed 32 bit integer         |
| `i64`  | Signed 64 bit integer         |
| `f32`  | 32 bit floating point         |
| `f64`  | 64 bit floating point         |
| `c32`  | 32 bit complex floating point |
| `c64`  | 64 bit complex floating point |

#### Basic Types

A single type.

```mj
u32 number
String name
Box<f64> doubles
```

#### Derived Types

A basic type augmented with `()`, `[]`, `*`, or `&`.

 A declaration can have exactly one basic type, and it's always on the far left of the expression.

The "basic types" are augmented with "derived types":

- `&` **reference to...**
    This is denoted by the familiar `&` character, and it should be self evident that a pointer always has to reference something.
- `*` **pointer to...**
    This is denoted by the familiar `*` character, and it should be self evident that a pointer always has to point to something.
- `[N]` **array of...**
- `[]` **slice of...**

  "Array of" sizes don't really play significantly into reading a declaration. We
  typically include the size in the description. It should be clear that arrays
  have to be "arrays of" something.

- `()` **function returning...**

  This is usually denoted by a pair of parentheses together - `()` - though
  it's also possible to find a prototype parameter list inside. Parameters
  lists (if present) don't really play into reading a declaration, and we
  typically ignore them. We'll note that parens used to represent "function
  returning" are different than those used for grouping: grouping parens
  surround the variable name, while "function returning" parens are always
  on the right. Functions are meaningless unless they return something (and
  we accommodate the void type by waving the hand and pretend that it's
  "returning" void).
- `()` **returning...**

The "array of" `[]` and "function returning" `()` type operators have higher
precedence than "pointer to" `*` and "reference to" `&`, and this leads to
some fairly straightforward rules for decoding.

```mj
void*[4]& fn_ret_ref_to_arr_of_ptr()
```

```mj
u32* number
String(u32 size)* name
Box<f64>& doubles[4]
```

### Type Aliases

Type aliases are declared using the type keyword

```mj
type List<String> StringBuffer
```

### Generic Types

Generic types are placeholders used to generate code for different types, so
they are not actually part of the type system.

```mj
class List<T> {
    ...
}

List<u32> list = List<u32>(7); // constructor
List<u32> list = {0, 1, 34, 65, 3}; // implicit cast of array literal to iterable

T add<T>(T &x, T &y) {
    ...
}
```

### Any Type

They identifier `_` may be used in place of a type to denote omission of a destination.

In variadic arguments, it can be used to denote a heterogenous list.

## Identifiers

## Literals

There are several forms of literal types.

Some are anonymous temporaries.

### Numeric Literals

Numbers are the fundamental type of information.

`[1-9][0-9]*`

`[1-9][0-9]*.[0-9]+`

`[1-9][0-9]*.[0-9]+[Ee][+-]?[0-9]+`

- Integer
- Signed Integer
- Unsigned Integer
- Floating Point

```mj
123u32
123i32
123f64
123x
```

Numeric Literal Type

### String Literals

#### Basic String Literals

```mj
"two\nlines"
```

#### Literal String Literals

```mj
'one\nline'
```

## Primitives

Primitives are atomic units of information.

```mj
// Actual implementation

// T is u8, u16, u32, or u64

// Z integer  types:  u8, u16, u32, u64, i8, i16, i32, i64
// R floating types:  f32, f64
// N unsigned types:  u8, u16, u32, u64
// Z signed   types:  i8, i16, i32, i64, f32, f64
```

// T must be an integer type, the enum is stored as T but accessed as Data &

```mj
// primitive
u32 i = 1
i32 j = -2
f32 k = 3.14

// array
u32 i[10] = [7, 3, 56]
u32 *i = [7, 3, 56]

// map, associative array, object
Map<String, u32> map = {
    "a": 3,
    "b": 4,
    "c": 56,
}
```
