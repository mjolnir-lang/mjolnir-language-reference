# Operators (Special Functions)

Operators are a finite set of non-identifier symbols which map to various builtin or user defined functions
or methods depending on the operand types.

There are several categories of semantics:

Operators may be grouped semantically:

- arithmetic
- bitwise
- logical
- relational
- equality
- and some combinations

It is recommended, though not required, that the semantics of an overloaded operator not be changed.

The syntax of operators cannot be changed. Binary and unary operators must have the same syntax
everywhere.

Operators are symbolic representations of various operations.

## Initialization

Initialization and destruction are the first an last operations performed on every object that is not globally scoped.

Unlike C++, object initialization may be deferred until later in the scope by initializing the value

### Default Initialization

Default initialization is shorthand for calling the default constructor for the
type at the time of declaration.

```mj
Type var
```

### Initialization by Assignment

```mj
Vector<u32> vec = Vector<u32>()

// These are equivalent
Vector<u32> vec = Vector<u32>([12, 34, 56])

// For single argument constructors, the constructor may be omitted and the value will be passed automatically.
// This is not done for assignment. Assignment which has been overloaded for a 
Vector<u32> vec = [12, 34, 56]

// Type casts may be perform implicitly when an assignment operator is not defined.
// If assignment is not defined for a type, but a constructor for that type is found,
// the constructor will be called and the value will be move assigned.
Vector<u32> vec = [12, 34, 56]
```

### Deferred Initialization

```mj
Type var = uninitialized
```

### Destruction

The destructor for a type is called when the variable goes out of scope.

When a reference goes out of scope it is not destroyed.

```mj
var.~Type()
```

### Explicit Initialization

Explicit initialization performs initialization on a variable which has already been defined.
It requires that the variable has been uninitialized by either declaring it as uninitialized
or by calling the destructor explicitly.

Uninitialized variables may not be passed used until they are assigned.

The only benefit of deferred initialization is for dynamic allocation of raw memory within collections
and iterative initialization of arrays.

It does not call the destructor is not called.

It is similar to C++ placement new.

```mj
Type var = uninitialized
var.Type()

Type var    // default initialization
var.~Type() // explicit destructor call
var.Type()  // explicit initialization
```

### Structure Initialization

Bitfields, structures, unions, and variants do not have constructors, but, with
the exception of bitfields, they do have destructors.

Structure initialization has two forms: structural and inlined.

When a structure is initialized, all of its members are initialized at the same time.

```mj
Point<u32> point = {0, 7}

void Bitmap::set_position(Point<u32> position)

bitmap.set_position({0, 3}) // Initialization and assignment allow the type of structure to be inferred.
bitmap.set_position(Point<u32> {0, 3}) // Also valid, but unnecessary

// However a type cast is not sufficient to infer the structure type, because casting is
// an operator that belongs to the type, and `{2, 4}` does not have a type by itself.
// Point is not able to define a constructor or assignment operator overload that can accept
// the untyped brace initializer.
u32 x = (Point<u32>: {2, 4}).x // invalid
```

```mj
Point<u32> point = {0, 7}
u32 x = Point<u32> {0, 7}.x
```

### Inline Initialization

Inline initialization can be considered a constructor call. This means that constant structure initialization
can be performed as with class constructors.

```mj
Point<u32> point = {
    .x = 0
    .y = 7
}
```

```mj
Point<u32> point = {
    .x = 0
    .y = 3 * .x + 7
}
```

## Structure Assignment

When structures and other POD types are assigned after being initialized, their destructor must be called.

Structures do not have assignment operator overloading, so the assignment operators for each member are called.

Using structural assignment allows only specified members to be assigned while preserving the values of
other members. Note that this is different from initialization in that unspecified members are default initialized when the
structure if being assigned.

## Assignment Operator

The assignment operator is similar to the initialization operator

| Symbol | Name | Description |
| ------ | ---- | ----------- |
| `=`    | Assignment                | |

## Compound Assignment Operators

Compound assignment operators modify a variable by performing an operation on it directly.

Semantically, they out to be equivalent to assigning the result of an operation to the first operand, though with the
benefit of not having to create an intermediate result. This semantic relationship should be preserved when overloading these
operators for user defined types.

These operators should only be defined for numeric types.

The use of `+=` for collections and strings, should be replaced with `.append()`.

| Symbol | Name | Description |
| ------ | ---- | ----------- |
| `+=`   | Arithmetic addition and assignment       | |
| `-=`   | Arithmetic subtraction and assignment    | |
| `*=`   | Arithmetic multiplication and assignment | |
| `/=`   | Arithmetic division and assignment       | |
| `%=`   | Arithmetic remainder and assignment      | |
| `&=`   | Bitwise AND and assignment               | |
| `\|=`  | Bitwise OR and assignment                | |
| `^=`   | Bitwise XOR and assignment               | |
| `<<=`  | Shift Left and assignment                | |
| `>>=`  | Shift Right and assignment               | |
| `&&=`  | Logical AND and assignment               | |
| `\|\|=`| Logical OR and assignment                | |
| `^^=`  | Logical XOR and assignment               | |

## Arithmetic Operators

The use of `+` for collections and strings, should be replaced with `.join()`.

| Symbol | Name | Description |
| ------ | ---- | ----------- |
| `+`    | Arithmetic addition      | |
| `-`    | Arithmetic subtraction    | |
| `*`    | Arithmetic multiplication | |
| `/`    | Arithmetic division       | |
| `%`    | Arithmetic remainder      | |

## Logical Operators

Logical operators return boolean values based on the truthiness of the arguments.

Arguments to these operators must be `bool`, so all arguments must provide an implicit a cast to `bool`.

| Symbol | Name | Description |
| ------ | ---- | ----------- |
| `!`    | Logical NOT | |
| `&&`   | Logical AND | |
| `\|\|` | Logical OR  | |
| `^^`   | Logical XOR | |

**Note:** Short circuit behavior applies to the logical binary operators `&&` and `||`, but not to `^^`,
such that subsequent expressions need not be evaluated if the expression is shown to have a value.

```mj
if (!string.is_empty() && string[0] == 'A') {
    // If the first expression is false, the second will not be tested, since its result will not affect
    // the value of the result.
}
```

## Bitwise Operators

| Symbol | Name | Description |
| ------ | ---- | ----------- |
| `~`    | Bitwise NOT            | |
| `&`    | Bitwise AND            | |
| `\|`   | Bitwise OR             | |
| `^`    | Bitwise XOR            | |
| `<<`   | Logical Shift Left     | |
| `>>`   | Arithmetic Shift Right | |
| `>>>`  | Logical Shift Right    | |

## Relational Operators

| Symbol | Name | Description |
| ------ | ---- | ----------- |
| `==`   | Equal to                 | |
| `!=`   | Not equal to             | |
| `>`    | Greater than             | |
| `<`    | Less than                | |
| `>=`   | Greater than or equal to | |
| `<=`   | Less than or equal to    | |
| `<=>`  | Compare with    | |

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

## Operator Overloading

Operator overloading is a means of defining functions for the standard operators.

All operator overloading is done at global scope and should call methods when necessary.

If that cannot be done, method implementations may be used when private state is needed.

Copy python and auto-inherit operators?

Overloaded operators should follow the principle of least surprise, where the semantic
meaning of the operator is preserved.

| Operator | Mjolnir |
| -------- | ------- |
| `>`      | `is_greater()` |
| `<`      | `is_less()` |
| `==`     | `is_equal()` |
| `>=`     | `is_geq()` |
| `<=`     | `is_leq()` |
| `!=`     | `!is_equal()` |
| `>>`     | `shift_right()` |
| `<<`     | `shift_left()` |
| `&`      | `and()` |
| `^`      | `xor()` |
| `\|`     | `or()` |
| `~`      | `invert()` |
| `+`      | `posative()` |
| `–`      | `negate()` |
| `++`     | `increment()` |
| `--`     | `decrement()` |
| `++`     | `post_increment()` |
| `--`     | `post_decrement()` |
| `+`      | `add()` |
| `–`      | `subtract()` |
| `*`      | `multiply()` |
| `/`      | `divide()` |
| `%`      | `remainder()` |
| `+=`     | `add_inplace()` |
| `-=`     | `subtract_inplace()` |
| `*=`     | `multiply_inplace()` |
| `/=`     | `divide_inplace()` |
| `%=`     | `remainder_inplace()` |
| `>>=`    | `shift_right_inplace()` |
| `<<=`    | `shift_left_inplace()` |
| `&=`     | `and()_inplace` |
| `^=`     | `xor_inplace()` |
| `\|=`    | `or_inplace()` |
| `in`     | `in()` |
| `to`     | `to<T>()` |
| `as`     | `as<T>()` |
| `[]`     | `subscript()` |

In C++, operators are overloaded in the form of functions with special names.
As with other functions, overloaded operators can generally be implemented
either as a member function of their left operand's type or as non-member
functions.

These operators are not overloadable because they impact control flow:

`&&`, `||`, `^^`

These operators cannot be overloaded:

`.`, `::`, `sizeof`, `typeof`, `.*`, and `?:`

## Relational operators

```mj
bool {>}(const U &a, const V &b)
bool {<}(const U &a, const V &b)
bool {>=}(const U &a, const V &b)
bool {<=}(const U &a, const V &b)
bool {==}(const U &a, const V &b)
bool {!=}(const U &a, const V &b)

bool {!}(U &a)
```

## Bitwise operators

```mj
T {&}(const U &a, const V &b)
T {^}(const U &a, const V &b)
T {|}(const U &a, const V &b)
T {>>}(const U &a, const V &b)
T {<<}(const U &a, const V &b)

T {&=}(const U &a, const V &b)
T {^=}(const U &a, const V &b)
T {|=}(const U &a, const V &b)
T {>>=}(const U &a, const V &b)
T {<<=}(const U &a, const V &b)

T {~}(U &a)
```

## Assignment Operators

```mj
T {=}(const U &a, const V &b)
T Class::{=}(const V &b)
```

## Compound Assignment Operators

```mj
T {+=}(const U &a, const V &b)
T {-=}(const U &a, const V &b)
T {*=}(const U &a, const V &b)
T {/=}(const U &a, const V &b)
T {%=}(const U &a, const V &b)

T {++}(U &a)
T {--}(U &a)

T {++}(T &a)
T {--}(T &a)
```

## Arithmetic Operators

```mj
T {+}(const U &a, const V &b)
T {-}(const U &a, const V &b)
T {*}(const U &a, const V &b)
T {/}(const U &a, const V &b)
T {%}(const U &a, const V &b)

T {+=}(const U &a, const V &b)
T {-=}(const U &a, const V &b)
T {*=}(const U &a, const V &b)
T {/=}(const U &a, const V &b)
T {%=}(const U &a, const V &b)

T {+}(const U &a)
T {-}(const U &a)

T {++}(U &a)
T {--}(U &a)

T {++}(T &a)
T {--}(T &a)
```

## Miscellaneous Operators

```mj
T {=}(U &a)
T {[]}(U &a)
T {->}(U &a)
T {->*}(U &a)
T {()}(U &a)
T {*}(U &a)
T {&}(U &a)
```

## Type Cast Operators

```mj
T {()}(U &a)

// member cast
T to<T>()
T as<T>()
```

```mj
bool in()
```

## Operator Precedence and Associativity

Operator precedence determines the order in which operators are applied to expressions.

In math, the order of operations is our guide when evaluating expressions with multiple operators.

Left or right associativity can also be understood as binding power.

Operators that are left associative are evaluated from left to right.

```mj
u32 x = 9 * 8 / 2 * 3
u32 x = ((9 * 8) / 2) * 3
```

Operators that are right associative are evaluated from right to left.

```mj
u32 x = 9 * 8 / 2 * 3
u32 x = ((9 * 8) / 2) * 3
```
