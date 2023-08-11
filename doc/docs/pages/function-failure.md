# Fallible Functions

## Try/Catch

Function calls which may fail must be handled by the caller. This is done in 4 ways.

### Bubble

Bubbling the failure up the call stack is the default behavior.

```mj
u32 x = exact_half(73)
```

### Ignore

Ignoring the failure is done by wrapping failable code in a try block or try expression
and not handling the failure. Some optimizations may be performed if the calling code does
not handle the error. Some error checking on the called function may be optimized out.

```mj
try {
    u32 x = exact_half(73)
}

u32 x = try (exact_half(73))
```

### Try Block

```mj
try {
    u32 x = exact_half(73)
} catch {
    fail
}

try {
    u32 x = exact_half(73)
} catch (12) {
    // Handle error code 12...
} catch (5) {
    // Handle error code 5...
} catch {
    // Handle all error codes...
    fail
}
```

### Try Expression

```mj
u32 x = try (exact_half(73))

u32 x = try (exact_half(73)) {
    fail
}

u32 x = try (exact_half(73)) catch (7) {
    fail
}
```
