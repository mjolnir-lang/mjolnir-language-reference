# Control Flow

## If

The `if` statement executes a block conditionally. `else` runs when the condition is false. `else if` chains additional conditions.

```mj
if x > 0 {
    print("positive")
} else if x < 0 {
    print("negative")
} else {
    print("zero")
}
```

### If Expression

In expression form, `then` and `else` act as keyword separators rather than block delimiters:

```mj
int x = if a < b then a else b
```

Here `then` is a syntactic separator between the condition and the result, not a continuation block. This is a distinct role from `then` in statement form and is unaffected by the restriction on continuation blocks in expressions.

If expressions may be nested and chained:

```mj
n32 y = if try fun() else false
    then 7
    else if ex()
        then use df()
        else 0
```

### If with Catch

When the condition is fallible, `try` is required. `catch` may follow to handle errors inline:

```mj
if try expr() {
    // true
} else {
    // false
} catch Error::INVALID_INPUT {
    // specific error
} catch {
    // any error
}
```

## Match

The `match` statement compares an expression against a series of cases. Cases are tested in order. `else` runs if no case matched.

```mj
match expr
case 0 {
    print("zero")
} case 1 {
    print("one")
} else {
    print("other")
}
```

`then` may follow one or more cases and runs after any of those cases execute:

```mj
match expr
case 0 {
    print("zero")
} case 1 {
    print("one")
} then {
    print("less than two")
} case 2 {
    print("two")
} else {
    print("other")
}
```

### Match Expression

In expression form, cases use `=>` arrows instead of braces:

```mj
n32 x = match expr
    case 0 => 5
    case 4 => 6
    else 0
```

`then` as a continuation block is not available in expression form. Control flow constructs like `break` do not propagate through expressions, so there is no completion state to attach a continuation to.

When a case arm requires multiple statements, a block followed by `=> expr` extracts the result from the scope:

```mj
n32 x = match expr
    case 5 => { n32 var = 35; var += 2 } => var
    else 0
```

Match expressions may be nested. Because indentation is semantic, the inner match's cases must be indented an additional level to associate them with the inner expression rather than the outer one:

```mj
n32 x = match match expr
            case 2 => 32
            case 7 => 37
            else 0
    case 37 => 73
    else 0
```

The double-indented cases belong to the inner `match expr`. The single-indented cases belong to the outer `match`.

### Match with Catch

When the matched expression is fallible, `try` is required. `catch` may follow to handle errors inline:

```mj
match try expr()
case 3 {
    ...
} else {
    // no match
} catch Error::INVALID_INPUT {
    ...
} catch {
    ...
}
```

## Loops

All loop forms support `then` and `else` blocks. `then` runs when the loop completes without a `break`. `else` runs when a `break` is encountered.

```mj
for int n in list {
    if n > 100 {
        break
    }
    print(n)
} then {
    print("completed")
} else {
    print("broken")
}
```

### Do Loop

Executes the loop body unconditionally and indefinitely.

```mj
do {
    ...
}
```

### While Loop

Tests the condition before each iteration.

```mj
while condition {
    ...
}
```

### Do-While Loop

Executes the body once before testing the condition. When a second block follows the condition, it runs only when the condition is true:

```mj
do {
    ...
} while condition {
    // runs only when condition is true
}
```

### Do-Until Loop

Equivalent to `do-while` with an inverted condition:

```mj
do {
    ...
} until condition
```

```mj
do {
    ...
} until condition {
    // runs only when condition is false
}
```

### For Loop

Iterates over a range or iterable. The loop variable is scoped to the loop body.

```mj
for n32 i in range(0, 74) {
    ...
}
```

## Error Handling

Error handling is a first-class control flow mechanism. Errors are values of type `Error`, a global enum assigned ranges at compile or link time. New error variants are declared as error sets.

Functions that may fail are fallible. The caller must explicitly handle, bubble, or ignore a fallible result — implicit propagation is not permitted.

### Failing

The `fail` keyword exits a fallible function with an error value. It is the error counterpart to `return` — `return` exits with a result, `fail` exits with an error:

```mj
fail              // default error (1)
fail 2            // specific error code
fail error - 32   // computed error value
```

`fail` without a value emits the default error code of 1. Using `fail` in a non-fallible function is a compile error.

### Bubbling

The `try` keyword propagates a failure to the caller if one occurs:

```mj
n32 x = try exact_half(73)
```

### Default Value

A default can be provided with `else`, used if the call fails:

```mj
n8 x = try expr() else 32
```

### Ignoring

The `use` keyword discards error checking entirely. Some error-checking code in the callee may be optimized out:

```mj
n8 x = use expr()
```

Calling a fallible function without `try` or `use` is a compile error.

### Catch

`catch` handles a failure inline. A bare `catch` handles any error; a named `catch` handles a specific error type. `then` after a catch chain runs regardless of which branch was taken:

```mj
n8 x = try expr()
catch Error::INVALID_INPUT {
    // specific error
} else {
    // any other error
} then {
    // always runs
}
```

`catch` may also appear inline on a match expression arm:

```mj
n32 x = match expr
    case 7 => try fun()
        catch FileError => fail 2
        catch Error error => fail error - 32
        else 7
    else 0
```

`then` as a continuation block is not available when `try` is used in expression form for the same reason — control flow does not propagate through expressions.

### Try Block

In statement form, `try` wraps a block and catches any failures that occur within it. `catch` must always name the error type it handles. `else` is shorthand for `catch Error` — the unconditional failure fallback — keeping `catch` strict and typed throughout:

```mj
try {
    ...
} catch Error::INVALID_INPUT {
    // catches a specific error
} catch ParserError {
    // catches a specific error type
} else {
    // shorthand for: catch Error {
} then {
    // always runs
}
```

In expression form, `else` is shorthand for `catch Error =>`:

```mj
n8 x = try expr() else 32                     // shorthand for: catch Error => 32
n8 x = try expr() catch Error::INVALID => 32  // specific error with default value
```

`catch` without a type is never valid — `else` exists precisely to fill that role without violating the rule that `catch` always names something.
