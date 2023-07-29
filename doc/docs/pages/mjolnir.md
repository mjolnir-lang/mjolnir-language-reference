# Mjolnir Programming Language

Mjolnir is a systems programming language with an emphisis on transparent memory
management. It inherits the C/C++ type system, but introduces more features.

## Why Create another langauge

There are may programming languages, each one has a purpose. In systems
programming, there is a heavy emphasis on interacting directly with hardware
and with the computer architecture to achive complete control and performance.

The most popular systems programming languages at this time are Ada, C, C++, D,
Go, Rust, and Swift. These languages each have pros and cons which Mjolnir
seeks to address.

## What does this language offer

Mjolnir is heavily inspired by C and C++. It aims to provide more expressive
syntax for bit fields, register access, memory management, record strcure,
memory access, explicit optimizations, functional transparency, and type
safety.

## Syntax

Before introducing the language syntax, the structure of the language should be explained.

Mjolnir places a strong emphasis on transparency and all syntax and design descisions
reflect that purpose. Some key elements to consider are memory storage and access,
because, at the end of the day, Mjolnir is a language which defines operations to be
performed on memory and not simply on types.

### The Type System

The Mjolnir type system is similar to C and C++, except it removes undefined behavior.

Some notable differences:

- All fundamental types have a fixed size.
- A byte is exactly 8 bits.
- Signed integers use only 2's compiment arithmetic
- Memory accesses are performed in order for volatile types and when there are data dependencies.
- There are no R-values. You may take the address of a literal.
- Literals are not contants. They are temporaries.

#### Fundamental Types

Fundamental types are the fundamental units of the type system. All other types are defined as
combinations or derivations of the fundamental types.

| Type   | Size | Alignment | Description                              |
| ------ | ----:| ---------:| ---------------------------------------- |
| `u8`   |    1 |         1 | Unsigned 8 bit integer                   |
| `u16`  |    2 |         2 | Unsigned 16 bit integer                  |
| `u32`  |    4 |         4 | Unsigned 32 bit integer                  |
| `u64`  |    8 |         8 | Unsigned 64 bit integer                  |
| `i8`   |    1 |         1 | Signed 8 bit integer (2's compliment)    |
| `i16`  |    2 |         2 | Signed 16 bit integer (2's compliment)   |
| `i32`  |    4 |         4 | Signed 32 bit integer (2's compliment)   |
| `i64`  |    8 |         8 | Signed 64 bit integer (2's compliment)   |
| `f32`  |    4 |         4 | 32 bit floating point (IEEE 754)         |
| `f64`  |    8 |         8 | 64 bit floating point (IEEE 754)         |
| `c32`  |    8 |         4 | 32 bit complex floating point (IEEE 754) |
| `c64`  |   16 |         8 | 64 bit complex floating point (IEEE 754) |
| `bool` |    1 |         8 | 8 bit boolean (always 0 or 1) |
| `void` |    - |         8 | The void type |
| `_ *`  | 4 \| 8 |  4 \| 8 | 32 or 64 bit memory address (depending on system address space) |

##### Basic Type Syntax

A single type.

```mj
u32 number;
String name;
Box<f64> doubles;
```

##### Derived Type Syntax

A basic type augmented with `()`, `[]`, `*`, or `&`.

 A declaration can have exactly one basic type, and it's always on the far left of the expression.

The "basic types" are augmented with "derived types", and C has three of them:

- `&` **reference to...**
    This is denoted by the familiar `&` character, and it should be self evident that a pointer always has to reference something.
- `*` **pointer to...**
    This is denoted by the familiar `*` character, and it should be self evident that a pointer always has to point to something.
- `[]` **array of...**

  "Array of" can be undimensioned -- `[]` -- or dimensioned -- `[10]` -- but
  the sizes don't really play significantly into reading a declaration. We
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

The "array of" `[]` and "function returning" `()` type operators have higher
precedence than "pointer to" `*` and "reference to" `&`, and this leads to
some fairly straightforward rules for decoding.

```mj
void *(&fn_ret_ref_to_arr_of_ptr_to_void())[];
```

```mj
u32 *number;
String (*name)(u32 size);
Box<f64> &doubles[4];
```

##### Type Declarations

Classes, Structs, unions, variants, enums, types, interfaces

### Funcions, Methods, Constructors, Destructors, and Initialization Contexts
