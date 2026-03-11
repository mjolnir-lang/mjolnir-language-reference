# Initialization

## Overview

Initialization is the process of assigning an initial value to an object at the moment of its
creation. It establishes the object’s invariants and ensures it begins its lifetime in a valid
state. Initialization is distinct from assignment, which modifies an object after its lifetime
has already begun.

Initialization occurs exactly once per object lifetime.

## Object Lifetime

An object’s lifetime consists of three phases:

1. **Storage acquisition** – memory is reserved.
2. **Initialization** – the object is given its initial value.
3. **Destruction** – the object's lifetime ends and any cleanup occurs.

Initialization begins the lifetime of the object.

Example:

```mj
int x = 5
```

Steps:

* Storage allocated for `x`
* `x` initialized with value `5`
* `x` is now alive and usable

---

## Forms of Initialization

### Default Initialization

Occurs when no explicit initializer is provided.

```mj
int x
```

Behavior depends on storage duration:

* Automatic storage: value is indeterminate
* Static storage: value is zero-initialized

Default initialization may leave primitive types uninitialized.

---

### Value Initialization

Explicit initialization with a default value.

```mj
int x = int()
```

Result:

* `x` is initialized to zero

Value initialization guarantees a well-defined initial state.

---

### Direct Initialization

Initializer is provided explicitly using constructor-style syntax.

```mj
Point<n32> p = Point<n32>(10, 20)
```

Semantics:

* Arguments are passed to the type’s initializer
* Object is constructed directly

No intermediate temporary is required.

---

### Copy Initialization

Object is initialized from another value of the same or compatible type.

```mj
Point p = other
```

Semantics:

* `other` is evaluated
* `p` is initialized from that value

This may invoke copy or conversion behavior.

---

### 3.5 Aggregate Initialization

Used for simple composite types.

```mj
struct Point {
    int x
    int y
}

Point p = {10, 20}
```

Semantics:

* Members initialized in declaration order

---

## 4. Constant Initialization

Objects declared constant must be initialized.

```mj
const int x = 5
```

Failure to initialize a constant is an error.

Constants cannot be assigned after initialization.

---

## 5. Initialization vs Assignment

These are fundamentally different operations.

Initialization:

```mj
int x = 5
```

Assignment:

```mj
x = 10
```

Key differences:

| Initialization       | Assignment                |
| -------------------- | ------------------------- |
| Occurs once          | Occurs any time           |
| Begins lifetime      | Requires existing object  |
| May use constructors | Uses assignment semantics |

---

## 6. Initialization of Composite Objects

Composite objects initialize their members.

Example:

```mj
struct Rect {
    Point min
    Point max
};

Rect r = { {0,0}, {10,10} }
```

Order:

1. `min` initialized
2. `max` initialized

Initialization order is fixed by declaration order.

---

## 7. Static Initialization

Objects with static storage duration are initialized before program execution begins.

Two phases:

### Zero Initialization

All storage set to zero.

### Constant Initialization

Explicit constant values applied.

---

## 8. Initialization Failure

If initialization cannot complete:

* Object lifetime never begins
* Storage is reclaimed
* Program may terminate or propagate error

Partially initialized objects do not exist.

---

## 9. Initialization Guarantees

Initialization guarantees:

* Object invariants are established
* Object is safe to use
* Members are initialized in defined order
* Initialization occurs exactly once

---

## 10. Design Principles

A well-designed initialization system should:

* Prevent use of uninitialized objects
* Clearly distinguish initialization from assignment
* Support efficient direct initialization
* Ensure deterministic initialization order
* Enforce initialization of constants

---

## Summary

Initialization is the mechanism that gives objects their first valid state and begins their lifetime. It is distinct from assignment and follows strict ordering and lifetime rules. Proper initialization is essential for correctness, safety, and predictability in a C-style programming language.











Initialization is a 

The question mark operator (`?`) marks storage that may or may not currently contain a valid initialized value. It is a compile-time construct used for initialization tracking and fallible initialization. It does not introduce runtime tagging or additional storage.

This operator unifies:

* Maybe-initialized storage
* Fallible function results
* Deferred initialization

All are different expressions of the same underlying principle: **storage may or may not have been written with a valid value yet**.

---

## Overview

```text
T    definitely initialized storage
T?   maybe-initialized storage
```

A `T?` occupies the same memory as `T`, but the compiler tracks whether a valid value has been written.

Initialization state is a compile-time property, not runtime data.

---

## Initialization State

Every `T?` storage location is in one of two states:

```text
Uninitialized
Initialized
```

State transitions:

```text
write value      → Initialized
drop value       → Uninitialized
failed write     → remains Uninitialized
```

The compiler prevents reads from uninitialized storage.

---

## Declaring Maybe-Initialized Variables

Example:

```mj
int? x
```

Initial state:

```text
x is Uninitialized
```

Assigning a value:

```mj
x = 10
```

State becomes:

```text
x is Initialized
```

Reading before initialization is an error:

```mj
int? x
print(x)   // compile error
```

---

## Using Maybe-Initialized Values

Before a value can be used as `T`, it must be known to be initialized.

Example:

```mj
int? x
x = 5
print(x)   // valid
```

The compiler verifies initialization before use.

---

## Fallible Function Returns

Functions may return maybe-initialized results:

```mj
int? parse()
```

This means:

* The function attempts to initialize the destination storage.
* On success, the value is written.
* On failure, the destination remains uninitialized.

Example:

```mj
int? x
x = parse()
```

After this:

```text
x may be initialized or uninitialized
```

The caller must handle both cases.

---

## Unwrapping

The unwrap operator asserts that initialization succeeded:

```mj
int x = try parse()
```

Behavior:

* If initialization succeeded, execution continues normally.
* If initialization failed, control flow is transferred (return, panic, or catch).

After unwrap:

```text
x is guaranteed Initialized
```

---

## Deferred Failure Handling

Failure handling can be deferred:

```mj
int? x = parse()
// The compiler will track the error code at runtime so we can test `uninitialized`
print(if x is uninitialized then "failed" else x)
```

Or with a default value:

```mj
int x = parse() else 0
```

This ensures initialization regardless of success or failure.

---

## Assignment Semantics

Assignment to `T?` storage attempts initialization:

```mj
int? x
x = compute()
```

Conceptually:

```text
drop previous value of x

attempt to write new value

if success:
    x becomes Initialized

if failure:
    x remains Uninitialized
```

---

## Deferred Initialization

Maybe-initialized types enable deferred initialization:

```mj
int?[100] buffer

buffer[0] = 10
buffer[1] = 20
```

The compiler tracks initialization where possible.

Programmer logic determines valid usage.

---

## Relationship to Definite Types

A `T?` can be used as `T` only when initialization is guaranteed.

Example:

```mj
int? x
x = 5
int y = x
```

Valid because `x` is initialized.

---

## Drop and Reinitialization

Dropping a value returns storage to uninitialized state:

```mj
drop(x)
```

Now:

```text
x is Uninitialized
```

A new value may be assigned later.

---

## Memory Representation

`T?` has identical layout to `T`.

It does not add:

* flags
* tags
* padding

Initialization tracking exists only in the compiler.

---

## Pointers and Maybe-Initialized Types

Pointer nullability and initialization are independent:

```mj
int?* ptr    // non-null pointer to maybe-initialized Int
int?^ ptr    // nullable pointer to maybe-initialized Int
```

The pointer may be valid even if the value is uninitialized.

---

## Summary

The `?` operator provides compile-time tracking of initialization state.

It enables:

* fallible initialization
* deferred initialization
* efficient container construction

It guarantees:

* no uninitialized value is read
* no runtime overhead is introduced

It represents storage that may or may not yet contain a valid value.
