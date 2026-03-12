# Initialization

Initialization is the process of assigning an initial value to an object at the moment of its creation. It establishes the object's invariants and ensures it begins its lifetime in a valid state. Initialization is distinct from assignment, which modifies an already-living object, and occurs exactly once per object lifetime. When an instance in uninitialized, it's lifetime tracking is restarted; this would require all references to be invalidated.

---

## Object Lifetime

An object's lifetime has three phases:

1. **Storage acquisition** — memory is reserved
2. **Initialization** — the object receives its initial value and its lifetime begins
3. **Destruction** — resources are released and the lifetime ends

Destruction happens implicitly when an object goes out of scope, or explicitly via `uninitialized`:

```mj
void info(List<n32> data) {
    print(data)
    // data is destroyed here; ownership was transferred to this function
}

List<n32> data = [1, 3, 6, 9, 12]
data = uninitialized  // explicit destruction; data may not be accessed until re-initialized
```

---

## Forms of Initialization

- **Default initialization** — no explicit initializer provided. Primitives in automatic storage are indeterminate; static storage is zero-initialized.

  ```mj
  int x
  ```

- **Value initialization** — explicit default construction, guaranteed to produce a well-defined value.

  ```mj
  int x = int()  // x is zero
  ```

- **Direct initialization** — arguments passed explicitly to the type's constructor.

  ```mj
  Point<n32> p = Point<n32>(10, 20)
  ```

- **Copy initialization** — object initialized from another value of the same or compatible type.

  ```mj
  Point p = other
  ```

- **Aggregate initialization** — members of a composite type initialized in declaration order.

  ```mj
  Point p = {10, 20}
  ```

---

## Constants

Constants must be initialized at declaration and cannot be assigned afterward.

```mj
const int x = 5
```

---

## Initialization vs. Assignment

| | Initialization | Assignment |
| --- | --- | --- |
| **When** | Once, at creation | Any time after creation |
| **Effect** | Begins lifetime | Modifies existing object |
| **Requires** | Storage | Already-living object |

---

## Initialization Modifiers

Initialization state can be expressed in type declarations using two modifiers: `?` for uncertain initialization and `!` for definite uninitialized state or non-returning behavior.

### Maybe-Initialized (`T?`)

The `?` qualifier marks storage that may or may not contain a valid initialized value. It occupies identical memory to `T` — no flags, tags, or padding are added. Initialization state is a compile-time property only.

```mj
int? x        // x is Uninitialized
x = 5         // x is now Initialized
int y = x     // valid; x is known to be initialized

int? z
print(z)      // compile error; z is not yet initialized
```

State transitions:

| | |
| --- | --- |
| write value | Initialized |
| drop value | Uninitialized |
| failed write | remains Uninitialized |

`T?` is also used as a function return type to indicate a fallible operation. If the function succeeds, the returned value is fully initialized; if it fails, the caller must handle the uninitialized result.

```mj
int? parse_int(String s)
```

`T?` enables deferred initialization, where storage is declared before a value is known:

```mj
int?[100] buffer
buffer[0] = 10
buffer[1] = 20
// remaining entries remain Uninitialized
```

A `T?` may only be used as `T` when the compiler can verify it is initialized. After an explicit drop, the storage returns to the uninitialized state and may be written again:

```mj
drop(x)       // x is Uninitialized
x = 42        // x is Initialized again
```

### Definitely Uninitialized (`T!`)

The `!` modifier indicates definite uninitialized state. When applied to a local variable, it is a compiler directive declaring that the variable will not be initialized at declaration — the type of `T!` is exactly `T`. The programmer is responsible for initializing the storage before reading it.

```mj
T!* x        // pointer to uninitialized T
T![N]* arr   // pointer to array of N uninitialized T
```

When `!` appears in a deeply nested type expression, the same rule applies: initialization tracking through that type is always assumed to start uninitialized.

When applied to a function's return type, `!` extends naturally to mean the function will never return, serving as the bottom type in control-flow reasoning:

```mj
void! panic(String msg)
```

### Pointer Validity vs. Pointee Initialization

Pointer nullability and initialization state are independent. A pointer may be valid while the memory it points to is uninitialized:

```mj
T?*   // non-null pointer to maybe-initialized T
T?^   // nullable pointer to maybe-initialized T
T!*   // non-null pointer to definitely uninitialized T
```

---

## Summary

| Modifier | Meaning | Typical Use |
| --- | --- | --- |
| `?` | May be uninitialized | Optional variables, fallible returns, deferred initialization |
| `!` | Definitely uninitialized, or never returns | Uninitialized storage, bottom type functions |
