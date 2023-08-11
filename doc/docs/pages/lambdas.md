# Lambdas

Lambdas are anonymous functions.

```mj
u32 (u32 a) *func = a => (37 * a) + 9
u32 result = func(7)
```

```mj
u32 result = (a => (37 * a) + 9)(7)
```
