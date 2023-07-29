# Lambdas

Lambdas are anonymous functions.

```mj
u32 (*func)(u32 a) = (a) -> {
    return (37 * a) + 9;
};

u32 result = func(7);
```

```mj
u32 result = (u32 a) -> {
    return (37 * a) + 9;
}(7);
```
