# Generic Functions

A generic function is parameterized over one or more type parameters. The function body is written against the constraints of the parameters and is valid for any argument types that satisfy those constraints.

```mj
T min<Orderable T>(T a, T b) {
    if a < b then a else b 
}
```

```mj
T average<Number T>(T[] a)
```

The shorthand generic form here is ambiguous. The return value will be abstract if the argument is abstract.

But the argument type is also not abstract at the top level.
`Number[]` is either equivalent to `Slice<Number T>` or `Slice<Number>`

```mj
Number average(Number[] a)
```

Dispatch for a generic function is determined by the argument types at the call site. Passing concrete types produces a monomorphized specialization of the function with static dispatch throughout. Passing abstract types produces a version operating through dynamic dispatch. The function definition is written once and handles both cases — the caller's argument types determine the dispatch mode, not the function signature.

## Monomorphization

When a generic function is called with concrete type arguments, the compiler generates a specialized version of the function body for those specific types. This specialization is performed at compile time and produces code with no generic overhead — the resulting function is equivalent to one written directly for those types.

Monomorphization may produce multiple copies of a function body when called with different concrete argument types. This is the standard tradeoff of static dispatch — code size increases in exchange for zero dispatch overhead and full inlining opportunities.

## Dynamic Specialization

When a generic function is called with abstract type arguments, no monomorphization occurs. The function operates through dynamic dispatch for the abstract parameter. The same function body serves all abstract callers without duplication. This is the appropriate choice for large functions or library functions intended to work with any conforming type, where the cost of dispatch is acceptable and code duplication is undesirable.
