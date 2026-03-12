# Then

The `then` keyword attaches a block that runs when a preceding control flow statement completes without encountering a `break`. It pairs with `else`, which runs when a `break` is encountered, giving both outcomes an explicit, named branch.

Python uses `else` after loops for the same purpose — running when the loop condition becomes false naturally — but this has proven unintuitive in practice. The more natural mental model treats subsequent blocks as dependent on what happened *inside* the loop body, not on the loop condition. `then` makes that model explicit.

```mj
for int n in list {
    if n > 100 {
        break
    }
    print(n)
} then {
    // loop completed without a break
    print("done")
} else {
    // break was encountered
    print(n)
}
```

In a `match` statement, `then` may appear after individual cases and runs after that case's block executes:

```mj
match id
case 0 {
    print(0)
} case 1 {
    print(1)
} then {
    // runs after case 0 or case 1
    print("less than 2")
} case 2 {
    print(2)
} then {
    // runs after case 2
    print("exactly 2")
} else {
    // no case matched
    print("greater than 2")
}
```
