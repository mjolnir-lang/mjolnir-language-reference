# Types

The Mjolnir type system is a static mapping of data to a set of operations that may be performed on that data.

Syntax is very closely related to program structure and execution.

Types are akin to metadata used by the compiler to perform transformations on storage.

Storage: size, alignment, constant, volatile, type, access, unique, address, offset

When alignment is artificially increased, the size of the type is as well so as
to preserve alignment in arrays. It would be nice to reclaim those holes.

- [Type Syntax](#type-syntax)
  - [Basic Types](#basic-types)
  - [Derived Types](#derived-types)
  - [Type Qualifiers](#type-qualifiers)
- [Fundamental Types](#fundamental-types)
  - [Units of Measure](#units-of-measure)
- [Generic Types](#generic-types)
- [Type Definitions](#type-definitions)
  - [Type Aliases](#type-aliases)
  - [Structures](#structures)
  - [Unions](#unions)
  - [Classes](#classes)
  - [Variants](#variants)
  - [Enumerations](#enumerations)
  - [Interfaces](#interfaces)
- [Type Declarations](#type-declarations)

asdf

- [Functions](#functions)
- [Methods](#methods)
- [Members](#members)
- [Scopes](#scopes)

## Identifiers

All program memory is accessed through the type system. Types define the operations that can
be performd on data, and identiifers are used to designate instances of types.

## Type Syntax

There are four syntactic elements in type declarations:

- basic types
- storage qualifiers (optional)
- type specifiers (optional)
- generic type specifiers (optional)
- identifiers (optional, given if declaring an instance of the type)

### Basic Types

Basic Types are identifiers which represent a type. They are composed of
alphanumeric characters and the underscore character, but they may not begin
with a decimal digit.

> Style: Basic Type names should be written using Pascal case. (e.g. `BasicType`, `RGBColor`)
> Achronyms should be capitalized, unles they conflict with a constant. They generally should not contain
> underscore characters.
>
> The only exceptions to this rule are the fundamental types: `u8`, `i32`, `f64`, `bool`, `void`, etc.

```mj
u32 number;
String name;
Box<f64> doubles;
```

### Derived Types

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
void *(&fn_ret_ref_to_arr_of_ptr())[];
```

```mj
u32 *number;
String (*name)(u32 size);
Box<f64> &doubles[4];
```

### Type Qualifiers

Type Qualifiers are keywords which modify the properties of a type.

- `const` - This type qualifier means that memory may be modified through the
  type. It does not meany that the memory location is immutable, although that
  may also be true.

- `volatile` - This type qualifier means that memory may be modified beyond the
  control or knowledge of the compiler. This means that the compiler is not
  able to optimize away any memory accesses through that type, and all
  dependent code is non-deterministic.

```mj
const u32 size;  // constant u32
const u32 *data; // mutable pointer to constant u32
u32 *const data; // constant pointer to mutable u32
const u32 *const data; // constant pointer to constant u32
```

## Fundamental Types

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
u32 i = 1;
i32 j = -2;
f32 k = 3.14;

// array
u32 i[10] = [7, 3, 56];
u32 *i = [7, 3, 56];

// map, associative array, object
Map<String, u32> map = {
    "a": 3,
    "b": 4,
    "c": 56,
};
```


### Units of Measure

Units of measure are sub-types of the fundamental numeric types. They provide automatic conversion
and an additional layer of type safety for fundamental types.

## Pointers

Pointers have the size of the system address width. On 32 bit systems
they are 32 bits wide, on 64 bit systems they are 64 bits wide.

## References

References are pointers that have already been dereferenced.

## Arrays

Slices are owning sized contiguous data. The size is a type parameter.

```mj
// {u8 *data; @shared const u32 SIZE = 4;}
u8[4] array_of_4_u8;
```

## Slices

Slices are non-owning references to sized contiguous data.

```mj
// {u8 *data; u32 size;}
u8[] slice_of_u8; // wide pointer
```

## Generic Types

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

Generic Types may also decay into classes which operate on anonymous interfaces.

If the template only requires method access and operations on the type, then
an anonymous interface can be created to represent that contract and each
use of the may be bound to that interface.

This results in a trade off between performance and code size.

Interfacing may only be useful for multiple, non-performant implementations.

## Type Aliases

Type aliases are declared using the type keyword

```mj
type List<String> StringBuffer;
```
