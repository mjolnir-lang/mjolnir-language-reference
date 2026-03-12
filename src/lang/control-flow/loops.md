# Loops

## Do-loop

A `do-loop` statement repeatedly executes the loop body forever.

```mj
do {
    ...
}
```

## Do-while-loop

A `do-while` loop statement combines the properties of the `do` and `while` loop statements to
create a middle tested loop.

```mj
do {
    // loop body
} while (...) // loop expression
```

### Middle-tested `do-while` loop

```mj
do {
    // always run
} while (...) {
    ...
}
```

## Do-until-Loop

```mj
do {
    ...
} until (...)
```

```mj
do {
    ...
} until (...) {
    ...
}
```

## For-Loop

```mj
for n32 i in range(0, 74) {
    ...
}
```

Equivalent

```mj
{
    n32 i = 0

    while i < 7 {
        ...
        i += 1
    }
}
```
