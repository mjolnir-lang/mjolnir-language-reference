# Mjolnir Syntax

This document is a refererence for the syntax and its corresponding rational
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
| `=`    | Assignemnt                               | |
| `+=`   | Arithmetic addition and assignemnt       | |
| `-=`   | Arithmetic subtraction and assignemnt    | |
| `*=`   | Arithmetic multiplication and assignemnt | |
| `/=`   | Arithmetic division and assignemnt       | |
| `%=`   | Arithmetic remainder and assignemnt      | |
| `&=`   | Bitwise AND and assignemnt               | |
| `\|=`  | Bitwise OR and assignemnt                | |
| `^=`   | Bitwise XOR and assignemnt               | |
| `<<=`  | Logical Shift Left and assignemnt        | |
| `>>=`  | Logical Shift Right and assignemnt       | |
| `^>=`  | Arithmetic Shift Right and assignemnt    | |
| `&=`   | Bitwise AND and assignemnt               | |
| `\|=`  | Bitwise OR and assignemnt                | |
| `^=`   | Bitwise XOR and assignemnt               | |

#### Arithmentic Operators

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
u32 number;
String name;
Box<f64> doubles;
```

#### Derived Types

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

### Type Aliases

Type aliases are declared using the type keyword

```mj
type List<String> StringBuffer;
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

They identifier `_` may be used in place of a type to denote a special meaning.

In variadic arguments, it can be used to denote a heterogenous list.

## Identifiers

## Literals

There are several forms of literal types.

Some are anonymous temporaries.

### Numaric Literals

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

## Enumerations

Enumerations are named values.

They are stored as an index, pointer, or structure depending on compliance to
enum properties.

Enumerations are short-hand notation for defining a homogenous, immutable set
of constant data structures referenced by unique identifiers and stored in an
unsigned integer.

Enumerations define an implicit cast to their index value.

```mj
// An enum is an array of any static type with set values corresponding to an index.
enum<u8> Month {
    String name;
    String abreviation;
    u8 month_of_year;
    u8 days;
    u8 days_on_leapyear;

    January   = {"January",   "Jan",  1, 31, 31};
    February  = {"February",  "Feb",  2, 28, 29};
    March     = {"March",     "Mar",  3, 31, 31};
    April     = {"April",     "Apr",  4, 30, 30};
    May       = {"May",       "May",  5, 31, 31};
    June      = {"June",      "Jun",  6, 30, 30};
    July      = {"July",      "Jul",  7, 31, 31};
    August    = {"August",    "Aug",  8, 31, 31};
    September = {"September", "Sep",  9, 30, 30};
    October   = {"October",   "Oct", 10, 31, 31};
    November  = {"November",  "Nov", 11, 30, 30};
    December  = {"December",  "Dec", 12, 31, 31};
}
```

The layout when expressed as a structure is equivalent to:

```mj
struct Month {
    const u8 _index;


    struct _Value {
        const String name;
        const String abreviation;
        const u8 month_of_year;
        const u8 days;
        const u8 days_on_leapyear;
    }


    class _ValueIterator {
        u32 index = 0;


        implements Iterator<const Month> {
            const Month &next(u32 offset = 1) {
                return (Month) index++;
            }


            const Month &previous(u32 offset = 1) {
                return (Month) --index;
            }
        }
    }


    class _Values {
        implements Iteratable<const Month> {
            Iterator<const Month> iterator() {
                return _ValueIterator();
            }


            Iterator<const Month> this[i32 start = 0:i32 stop = size:i32 step = 1] {
                return _ValueIterator();
            }
        }
    }


    shared {
        const Month January   = { 0};
        const Month February  = { 1};
        const Month March     = { 2};
        const Month April     = { 3};
        const Month May       = { 4};
        const Month June      = { 5};
        const Month July      = { 6};
        const Month August    = { 7};
        const Month September = { 8};
        const Month October   = { 9};
        const Month November  = {10};
        const Month December  = {11};
        const _Value _values[12] = [
            {"January",   "Jan",  1, 31, 31},
            {"February",  "Feb",  2, 28, 29},
            {"March",     "Mar",  3, 31, 31},
            {"April",     "Apr",  4, 30, 30},
            {"May",       "May",  5, 31, 31},
            {"June",      "Jun",  6, 30, 30},
            {"July",      "Jul",  7, 31, 31},
            {"August",    "Aug",  8, 31, 31},
            {"September", "Sep",  9, 30, 30},
            {"October",   "Oct", 10, 31, 31},
            {"November",  "Nov", 11, 30, 30},
            {"December",  "Dec", 12, 31, 31},
        ];

        _Values values;
    }


    const Data &|this.| = _values[_index];
    const Data *|this->| = &_values[_index];
    u8 |(u8) this| = _index;
}



Month month = Month::January;
stream.print("{:s}: {:u}, {:u}", month.name, month.days, Month::data[month].days);
```

However the type and operators are overloaded, such that the type is T, while
operators apply to Data.

## Unions

Unions have the space requirements of the largest member and alignment of the
member with the largest alignment, usually the same member.

Any member may be accessed regardless of the last member stored. This allows
the memory of other types to be accessed.

```mj
union {
    u32 number;
    Rectangle shape;
    Box *pointer;
}
```

## Structures

Structures are groups of related data. They maintain order and alignment requirements

There is no padding before the first element. There is padding between elements
only when required to preserve the alignment of the following member.
There is padding after the last member only when required to preserve the
alignemnt of the first member as in an array.

Structure do not have abstractions or implementations. They do not have constructors
or destructors. They may have members and methods. All of their members must be
primitives or structs.

```mj

// struct


// structs are accessed by member name. Always allow for that syntax
// constructors provide named hints



struct Rectangle {
    u32 width;
    u32 height;

    // auto generated default constructor.
    shared {



        // Overload the function operator on the type?
        Rectange Rectangle(
            u32 width = 0;
            u32 height = 0;
        ) {
        }

        // ex:
        Rectangle rect = Rectangle(rect, 23, 43);



        // C++, Java
        Rectangle(u32 width = 0, u32 height = 0);

        // ex:
        Rectangle rect = Rectangle(rect, 23, 43);



        // Rust
        Rectangle init(u32 width = 0, u32 height = 0);

        // ex:
        Rectangle rect = init(rect, 23, 43);



        // C, Python
        void init(Rectangle *this, u32 width = 0, u32 height = 0);

        // ex:
        Rectangle rect;
        init(rect, 23, 43);
    }
}


// C/C++
Rectangle rect = {56, 43};

// C
Rectangle rect = {
    .width = 56,
    .height = 43,
};

// C++ (looks like a function, can't be used in classes)
Rectangle rect(56, 43);

// C++
Rectangle rect;
rect.width = 56;
rect.height = 43;

// Java, Rust, Kotlin (and C++, but not recommended)
Rectangle rect = Rectangle(56, 43);

// Rust
Rectangle rect = Rectangle {
    width = 56,
    height = 43
};

// Tuple style?
Rectangle rect = (56, 43);

// Scoped assignment?
Rectangle rect = {
    width = 56;
    height = 0;

    for (u32 i = 0; i < width / 3; i++) {
        height += i;
    }
};



u32 *i = [7, 3, 56];

// tuple (anonymous struct? defined by storage, indexed by order)
<String, u32, f64> stuff = ("name", 4, 34.777);

```

## Variants

A variant is a combination of a union and an enum.

```mj

// Variant

class Event<T> {
    Data data;
    T type;

    union Data {
        f64 time;
        struct {
            u32 x;
            u32 y;
        } actor;
        u32 resume_choice;
        u8 exit_code;
    }


    shared<T> {
        const T Start  = 0;
        const T Pause  = 1;
        const T Resume = 2;
        const T Stop   = 3;
    }
}
```

## Classes

Classes are encapsulated data.

All members are private.

Shared members are can be grouped by template type or global.

### Members

Members are variables that belong to classes.

The placeholder identifier may be used to specify padding, or member may be
declared with an offset or address.

```mj

struct Thing {
    u32 name = 7;
    u8 _[32]; // <-- padding
    u32 comment @ 0x60 = 1234; // <--- offset

    shared @ 0x1FFE0000 {
        u32 data = 8;
    }
}


u32 comment @ 0xE00E8060 = 1234; // <--- address
```

### Methods

Methods are functions that belong to classes.

## Variables

Variables are storage locations with both type and identifier.

## Functions

Functions are expressions with return type, parameter types, and identifier.

## Interfaces

Interfaces are pure abstractions used to present a homogenous view of derived
classes. Interfaces may contain method declarations, methods, and shared scopes,
but they may not contain members or properties.

Interfaces are references implemented as 2 pointers, one for the class instance
and the other for the v-table. Since interfaces carry the overhead of an extra
pointer dereference, it is reasonable to use a wide pointer representation
instead of a reference to an interface containing a reference to the class
instance.

abstract classes carry state which causes problems with inheritance

diamond inheritance pattern
mutex wrapping

function overload drill down should be supported by default

## Scopes

Scopes are areas where syntax of the language is permitted or denied.

### Definition Scope

Definition scopes are used for defining types.

```mj
(class|enum<T>|union|variant|implements|interface|struct) <type name> {
    // Definition scope
}
```

### Initialization Scope

Initialization scopes are used for inline initialization.

```mj
struct Rectangle {
    u32 width;
    u32 height;
}


Rectangle rect = {
    // Initialization scope
    width = 7;
    height = 56;
}

class Vector<T> {
    T *data;
    u32 capacity = 0;
    u32 size = 0;

    void append(T &t) {
        data[size] = t;
        size += 1;
    }

    shared<T> {
        Vector<T> This(This &this, u32 capacity = 8) {
            data = allocate(capacity * T.size());
        }

        Vector<T> This(This &this, T *data, u32 size) {
            data = allocate(size * T.size());
            memory::copy(this.data, data, size * T.size());
        }

        Vector<T> This(This &this, T &args...) {
            data = allocate(args.size() * T.size());

            for (u32 i = 0; i < args.size(); i++) {
                data[i] = args[i];
            }
        }
    }
}


Vector<u32> vec = Vector<u32>(7);
Vector<u32> vec = Vector<u32>(5, 3, 2, 6, 4);

Vector<u32> vec;

Vector<u32>::init(vec, 5, 3, 2, 6, 4);
```

### Function Scope

Function scopes are used to define function bodies.

```mj
Type func_name() {
    // Function scope
}
```

### Shared Scope

Shared scopes are used to define types which belong to the class itself instead of objects.

Shared scopes must be defined in a class.

```mj
shared {
    // Shared scope
}
```

### Implementation Scope

Implementation scopes are used to map a class to an implementation.

```mj
implements <impl name> {
    // Implementation scope
}
```

## Variadic Parameters

Any function or constructor may contain one variadic argument.

### Homogenous List

```mj
void average(u32 &max, u32... args) {
    u32 n = min<u32>(args.size(), max);
    u32 sum = 0;

    for (u32 a : args[0:n]) {
        sum += a;
    }

    return sum / n;
}
```

### Heterogenous List

```mj
void average(u32 &max, ... args) {
    u32 n = min<u32>(args.size(), max);
    u32 sum = 0;

    for (u32 i = 0; i < n; i++) {
        sum += args[i];
    }

    return sum / n;
}
```

### Forwarding

When function arguments must be passed to another functions, variadic args may
be passed directly. The variadic funtion will inherit the parameters of the nested
call. the elipses are used directly and need not be named.

```mj
void call(u32 var, u32 max) {
    // code...
}

void safe_call(Mutex &mutex, ...) {
    mutex.lock();
    call(...);
    mutex.unlock();
}

// Equivalent...

void safe_call(Mutex &mutex, u32 var, u32 max) {
    mutex.lock();
    call(var, max);
    mutex.unlock();
}
```

## Try/Catch

Function calls which may fail must be handled by the caller. This is done in 4 ways.

### Bubble

Bubbling the failure up the call stack is the default behavior.

```mj
u32 x = exact_half(73);
```

### Ignore

Ignoring the failure is done by wrapping failable code in a try block or try expression
and not handling the failure. Some optimizations may be performed if the calling code does
not handle the error. Some error checking on the called function may be optimized out.

```mj
try {
    u32 x = exact_half(73);
}

u32 x = try (exact_half(73));
```

### Try Block

```mj
try {
    u32 x = exact_half(73);
} catch {
    fail;
}

try {
    u32 x = exact_half(73);
} catch (12) {
    // Handle error code 12...
} catch (5) {
    // Handle error code 5...
} catch {
    // Handle all error codes...
    fail;
}
```

### Try Expression

```mj
u32 x = try (exact_half(73));

u32 x = try (exact_half(73)) {
    fail;
}

u32 x = try (exact_half(73)) catch (7) {
    fail;
}
```
