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

It is recommented, though not required, that the semantics of an overloaded operator not be changed.

The syntax of operators cannot be changed. Binary and unary operators must have the same syntax
everywhere.

Operators are symbolic representations of various operations.

## Assignment Operators

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
| `>>=`  | Arithmetic Shift Right and assignemnt    | |
| `>>>=` | Logical Shift Right and assignemnt       | |
| `&=`   | Bitwise AND and assignemnt               | |
| `\|=`  | Bitwise OR and assignemnt                | |
| `^=`   | Bitwise XOR and assignemnt               | |

## Arithmentic Operators

| Symbol | Name | Description |
| ------ | ---- | ----------- |
| `+`    | Arithmetic addition       | |
| `-`    | Arithmetic subtraction    | |
| `*`    | Arithmetic multiplication | |
| `/`    | Arithmetic division       | |
| `%`    | Arithmetic remainder      | |

## Logical Operators

| Symbol | Name | Description |
| ------ | ---- | ----------- |
| `!`    | Logical NOT | |
| `&&`   | Logical AND | |
| `\|\|` | Logical OR  | |
| `^^`   | Logical XOR | |

**Note:** Short circuit behavior applies to logical operators `&&` and `||`,
such that as soon as the expression is evaluated.

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

## Operator Overloading

Operator overloading is a means of defining functions for the standard operators.

All operator overloading is done at global scope and should call methods when necessary.

If that cannot be done, method implmentations may be used when private state is needed.

Copy python and auto-inherit operators?

Overloaded operators should follow the principle of least surprise, where the semantic
meaning of the operator is preserved.

| Operator | Python | Mjolnir |
| -------- | ------ | ------- |
| `>`   | `__gt__`       | `is_greater()` |
| `<`   | `__lt__`       | `is_less()` |
| `==`  | `__eq__`       | `is_equal()` |
| `>=`  | `__ge__`       | `is_geq()` |
| `<=`  | `__le__`       | `is_leq()` |
| `!=`  | `__ne__`       | `is_not_equal()` |
| `>>`  | `__rshift__`   | `shift_right()` |
| `<<`  | `__lshift__`   | `shift_left()` |
| `&`   | `__and__`      | `and()` |
| `^`   | `__xor__`      | `xor()` |
| `\|`  | `__or__`       | `or()` |
| `~`   | `__invert__`   | `invert()` |
| `+`   | `__pos__`      | `posative()` |
| `–`   | `__neg__`      | `negate()` |
| `++`  |                | `increment()` |
| `--`  |                | `decrement()` |
| `++`  |                | `post_increment()` |
| `--`  |                | `post_decrement()` |
| `+`   | `__add__`      | `add()` |
| `–`   | `__sub__`      | `subtract()` |
| `*`   | `__mul__`      | `multiply()` |
| `/`   | `__div__`      | `divide()` |
| `%`   | `__mod__`      | `remainder()` |
| `+=`  | `__iadd__`     | `add_inplace()` |
| `-=`  | `__isub__`     | `subtract_inplace()` |
| `*=`  | `__imul__`     | `multiply_inplace()` |
| `/=`  | `__idiv__`     | `divide_inplace()` |
| `%=`  | `__imod__`     | `remainder_inplace()` |
| `>>=` | `__irshift__`  | `shift_right_inplace()` |
| `<<=` | `__ilshift__`  | `shift_left_inplace()` |
| `&=`  | `__iand__`     | `and()_inplace` |
| `^=`  | `__ixor__`     | `xor_inplace()` |
| `\|=` | `__ior__`      | `or_inplace()` |
| `in`  | `__contains__` | `in()` |
| `to`  | `(up cast)`    | `to<T>()` |
| `as`  | `(down cast)`  | `as<T>()` |
| `[]`  | `__index__`    | `subscript()` |

In C++, operators are overloaded in the form of functions with special names.
As with other functions, overloaded operators can generally be implemented
either as a member function of their left operand's type or as non-member
functions.

These operators are not overloadable because they impact control flow:

`&&`, `||`, `^^`

These operators cannot be overloaded:

`.`, `::`, `sizeof`, `typeof`, `.*`, and `?:`

Relational operators

```mj
bool {>}(const U &a, const V &b);
bool {<}(const U &a, const V &b);
bool {>=}(const U &a, const V &b);
bool {<=}(const U &a, const V &b);
bool {==}(const U &a, const V &b);
bool {!=}(const U &a, const V &b);

bool {!_}(U &a);
```

Bitwise operators

```mj
T {&}(const U &a, const V &b);
T {^}(const U &a, const V &b);
T {|}(const U &a, const V &b);
T {>>}(const U &a, const V &b);
T {<<}(const U &a, const V &b);

T {&=}(const U &a, const V &b);
T {^=}(const U &a, const V &b);
T {|=}(const U &a, const V &b);
T {>>=}(const U &a, const V &b);
T {<<=}(const U &a, const V &b);

T {~@}(U &a);
```

Arithmetic Operators

```mj
T {+}(const U &a, const V &b);
T {-}(const U &a, const V &b);
T {*}(const U &a, const V &b);
T {/}(const U &a, const V &b);
T {%}(const U &a, const V &b);

T {+=}(const U &a, const V &b);
T {-=}(const U &a, const V &b);
T {*=}(const U &a, const V &b);
T {/=}(const U &a, const V &b);
T {%=}(const U &a, const V &b);

T {+@}(const U &a);
T {-@}(const U &a);

T {++@}(U &a);
T {--@}(U &a);

T {@++}(T &a);
T {@--}(T &a);
```

Miscellaneous

```mj
T {=}(U &a);
T {@[]}(U &a);
T {->}(U &a);
T {->*}(U &a);
T {@()}(U &a);
T {*@}(U &a);
T {&@}(U &a);
```

Cast Operators

```mj
T {()@}(U &a);

// member cast
T to<T>();
T as<T>();
```

```mj
bool in();
```
