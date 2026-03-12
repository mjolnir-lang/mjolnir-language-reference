# Initialization

Value initialization and conditional usability are expressed via two distinct type operators: the **question mark (`?`)** and the **exclamation mark (`!`)**.

---

## Uncertain Initialization Modifier (`?`)

The question mark indicates **uncertain or conditional initialization**. It is used primarily in **function return types** and **optional storage**, where the value may or may not be initialized depending on control flow.

### Function return (fallible)

```mj
int? parse_int(String s)
```

* The function may fail.
* If the function succeeds, the returned `int` is fully initialized.
* If the function fails, the caller must handle the uninitialized result (e.g., via a `try` block or failure propagation).

### Optional / maybe-uninitialized variable

```mj
T? x
```

* `x` may or may not be initialized.
* The programmer or the compiler must check initialization before use.

### Pointers to maybe-uninitialized memory

```mj
T?* p  // non-null pointer to maybe-uninitialized T
T?^ p  // nullable pointer to maybe-uninitialized T
```

* The pointer itself is valid; the pointed-to memory may be uninitialized.
* Sequential initialization can be performed safely by the programmer.

---

## Uninitialized Type Modifier (`!`)

The exclamation mark indicates **definite uninitialized state**. Any value or type annotated with `!` is guaranteed to be uninitialized until explicitly initialized.

### Uninitialized storage

When a local variable as a whole is marked as uninitialized, the variable is declaring that
it will not be initialized when it is declared, but the type of `T!` is exactly `T`. The marker
is exclusively a compiler directive for tracking the initialization state of the variable initially.

When an exclamation mark is present in a deeply nested type expression, the same rule applies, but
the programmer must be aware that initialization tracking through that type will always be assumed to
be uninitialized.

```mj
T!* x       // pointer to uninitialized T
T![N]* arr  // pointer to array of N uninitialized T
```

* The programmer must initialize the value or memory before reading.
* Unsafe to access before initialization.

### Never-return / bottom type

When a function's return value as a whole is marked as uninitialized, the function is declaring that
it will not initialize that result and so we can extend the initialization modifier to mean the
function will never return.

```mj
void! panic(String msg)
```

* Indicates that the function will **never return**.
* Serves as the **bottom type** in type checking.
* Functions that do not initialize their result can be typed as `!`, simplifying control-flow reasoning.

---

## Summary

| Operator | Meaning                                           | Typical Use                                                     |
| -------- | ------------------------------------------------- | --------------------------------------------------------------- |
| `?`      | Value may be uninitialized / fallible             | Function return, optional variable, maybe-uninitialized pointer |
| `!`      | Value is definitely uninitialized / never returns | Uninitialized storage, bottom type functions                    |

---

## Notes

* `?` reflects **uncertain initialization** and propagates through control flow.
* `!` reflects **certain uninitialized state** or **non-returning behavior**.
* Pointers separate **pointer validity** from **pointee initialization**.
* This system ensures clear, orthogonal semantics for value safety, memory initialization, and control flow.
