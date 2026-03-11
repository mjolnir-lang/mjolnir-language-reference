# `return` Statement

Terminates the current function and returns the specified value (if any) to the caller.

## Syntax

### Bare return

A [function](../function.md#function) whose return type is [void](../types/fundamental-types.md#void) does not require an
explicit return statement at the end of the function body.

If control reaches the end of

- a function with the return type (possibly cv-qualified) void,
- a constructor,
- a destructor, or
- a function-try-block for a function with the return type (possibly cv-qualified) `void`

without encountering a `return` statement, `return` is executed.

Returning by value may involve construction and copy/move of a temporary object, unless copy elision is used. Specifically, the conditions for copy/move are as follows:
Automatic move from local variables and parameters

The expression is move-eligible if it is a (possibly parenthesized) id-expression that names a variable of automatic storage duration whose type is

- a non-volatile object type
- or a non-volatile rvalue reference to object type

and that variable is declared

- in the body or
- as a parameter

of the innermost enclosing function or lambda expression.

If the expression is move-eligible, it is treated as an xvalue (thus overload resolution may select the move constructor).

Guaranteed copy elision

If expression is a prvalue, the result object is initialized directly by that expression. This does not involve a copy or move constructor when the types match (see copy elision).

```mj
void fn(u32 x) {
    if (x == 0) {

        // explicit return
        return
    }

    // implicit return
}
```

### return value

```mj
u32 min(u32 a, u32 b) {
    if (a < b) {
        return a
    }

    return b
}
```
