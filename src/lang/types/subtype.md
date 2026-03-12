# Subtype

A subtype is 

## Variance

Variance is a property that generic types have with respect to their arguments and that
interfaces have with their implementations

- `F<T>` is covariant over `T` if `T` being a subtype of `U` implies that `F<T>` is a subtype of `F<U>` (subtyping "passes through")
- `F<T>` is contravariant over `T` if `T` being a subtype of `U` implies that `F<U>` is a subtype of `F<T>`
- `F<T>` is invariant over `T` otherwise (no subtyping relation can be derived)

Variance of common type templates

| Type | Variance |
| ---- | -------- |
| `const T&`                    | covariant |
| `T&`                          | invariant |
| `const T*`                    | covariant |
| `T*`                          | invariant |
| `T[] and T[n]`                | covariant |
| `T fn()`                      | covariant |
| `void fn(T)`                  | contravariant |
