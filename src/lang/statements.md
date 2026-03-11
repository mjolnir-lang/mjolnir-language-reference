# Statements

Statements and expressions make up all of executable code.

They use types and variables to perform operations on data.

Statements and expressions themselves do not require data memory aside from
stack and register usage.

## `{...}`

The block statement defines a new scope.

It is the only statement that is not terminated by a semicolon.

It shares syntax with array literals, initialization scopes, and other blocks.

## `if`

The `if` statement is used to conditionally execute a statement.

It may be specified with or without a trailing `else` keyword which serves the
purpose of defining the false path.

```mj
if (condition) {
    ...
}

if (condition) {
    ...
} else {
    ...
}
```

The condition of an if statement may alternatively be replaced with a
definition statement. In this case, the defined variable is added to the scope
of both the true and false paths.

```mj
if (definition) {
    ...
}

if (definition) {
    ...
} else {
    ...
}
```

## `while`

A while-loop is a 

```mj
while (condition) {
    body
}
```

A middle-tested while-loop is a variant of the while-loop where the condition is evaluated in the middle of the loop body.

This is a convenient pattern for handling special behavior at thye beginning ot the end of a loop.

Example:

This middle-tested while-loop will print a comma separated list of elements.

```mj
do {
    stdout.print("{:s}", element);
} while (condition) {
    stdout.write(", ");
}

stdout.write("\n");
```

## `until`

```mj
```

## `do-while`

```mj
```

## `do-until`

```mj
```

## `for`

```mj
for (before; condition; after) {
    ...
}
```

Example:

This middle-tested for-loop will print a comma separated list of elements.

```mj
do {
    stdout.print("{:s}", list[i]);
} for (u32 i = 0; i < list.size(); i++) {
    stdout.write(", ");
}

stdout.write("\n");
```

## `for-in`

```mj
for (T t in list) {
    ...
}
```

Example:

This middle-tested for-loop will print a comma separated list of elements.

```mj
List<String> list = ["a", "b", "c"];
stdout.write("[");

do {
    stdout.print('"{:s}"', string);
} for (String &string in list.size()) {
    stdout.write(", ");
}

stdout.write("]\n");
```

## `match`

```mj
match (u32 x = fn()) {
when (0) {
    ...
} when (2) {
    ...
} when (4) {
    ...
} when (8) {
    ...
} when (_) {
    // defualt
    ...
}
```

## `return`

```mj
T function() {
    return <T>;
}
```

## `yield`

```mj
T function() {
    yield <T>;
}
```

## `fail`

```mj
T function() {
    fail <u32>;
}
```

## `try`

```mj
try () {

}

try ...;
```

## `try-catch`

```mj
try {...} catch (_) ...
try {...} catch (6) ... catch (23) ... catch (u32 e = _) ...
```

## `in`

A boolean operator used to determine if something contains another thing.

```mj
if (3 in [2, 4, 7]) {
    ...
}
```

## `as`

The `as` operator is a conditional cast from an interface to a more specific
interface or a class.

```mj
Iterable<Box> var = List<Box>();

List<Box> var2 = (List<Box>) var; // not allowed by the type system
List<Box> var2 = var as List<Box>; // will succeed or return 'null'
```

```mj
u32 x = 7 as f32;
```

## `is`

The `is` operator returns a boolean value and takes a variable and a type as its arguments.

Because the type system enforces types, the only usage for the `is` operator is
for determining the implementation of an interface.

```mj
Iterable<Box> var = List<Box>();

bool result = var is List<Box>; // true
```

```mj
[4, 5, 2] is List<String> // false
[4, 5, 2] is u32[] // true
[4, 5f, 2] is f32[] // true

List<Box> var;
bool result = var is List<Box>; // true
bool result = var is Iterable<Box>; // true
```

## `at`

```mj
u32 var@0x1FFE0A10 = 7;
u32 var#16 = 7;
```

## `with`

Context manager.

```mj
with (definition|assignment) {
    ;
}
```
