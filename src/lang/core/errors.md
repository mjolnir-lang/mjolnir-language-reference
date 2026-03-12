# Errors

Error handling is a first-class control flow mechanism.

## What are Errors

Errors are special enum values of type `enum<n32> Error` and are assigned a range within a global error matrix
at compilation time or dynamically at link time.

### Error Sets

New errors are defined by declaring an error set, which is a partial enum of type `Error`.

## Error Handling

Errors may be caught and handled, deferred to the caller, or explicitly ignored when the caller
knows no error will be encountered.

It would be nice to infer the possibility of logic errors based on context, but that is too difficult.

## Fallible Functions

## Try/Catch

Function calls which may fail must be handled by the caller. This is done in 4 ways.

### Bubble

Bubbling the failure up the call stack requires the `try` keyword to avoid implicit control flow.

```mj
n32 x = try exact_half(73)
```

### Ignore

Ignoring the failure is done by wrapping fallible code in a try block or try expression
and not handling the failure. Some optimizations may be performed if the calling code does
not handle the error. Some error checking on the called function may be optimized out.

### Try Expression

fail with same error

```mj
n8 var = try expr() // re-throw error on failure
n8 var = use expr() // ignore error checking
n8 var = expr() // Compilation Error: Unhandled fallible function.
```

assign default value on error

```mj
n8 var = try expr() else 32
```

The ternary operator can be extended to return a default value if an error is returned by the
conditional expression.

```mj
n8 var = if (try expr() else 7) < 10
    then 43
    else 32
```

```mj
if expr() {
    // if true
} else {
    // if false
} catch Error::INVALID_INPUT {
    // if named error
} catch {
    // if any error
}


match expr() {
    // always run first
} case 3 {
    // if matched
} else {
    // if no match
} catch Error::INVALID_INPUT {
    // if named error
} catch {
    // if any error
}


match expr() {
    // always run first
    43 => {
        // if matched
    }

    Ipv4Address::{ .self[0] == 192, .self[3] == 255 } => {
        var = self[3]
    }
} else {
    // if no match
} catch Error::INVALID_INPUT {
    // if named error
} catch {
    // if any error
}
```

`var` will be `uninitialized`. Run alternative code.

```mj
n8 var = try expr() catch {
    var = 4
}
```

`var` will be `uninitialized`. handle error by match

```mj
n8 var = try expr() catch {
    // always run...
} catch Error::INVALID_SYMBOL {
    // specific error
} then {
    // always run...
}
```

```mj
n8 var = try expr() else 32 {
    // any
} catch ParserError error {
    // specific
} catch Ipv4ParserError error {
    // specific
} else {
    // no error
}
```
