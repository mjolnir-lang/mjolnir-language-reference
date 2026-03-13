# When Expressions

## Overview

A `when` expression tests a target value against a sequence of arms and evaluates the
body of the first matching arm. It is the primary construct for pattern matching and
multi-way conditional dispatch in Mjolnir.

`when` is semantically a context manager — the target expression is evaluated once and
held for the duration of the block. All arms operate within that context. The result of
a `when` expression is the value produced by the matching arm.

## Syntax

```txt
when <expression> {
    <arm>
    <arm>
    ...
}
```

Or with a local binding:

```txt
when <expression> as <name> {
    <arm>
    <arm>
    ...
}
```

## Local Binding

The `as` clause binds the result of the target expression to a name for the duration
of the `when` block. This is necessary when the target is a complex expression rather
than a simple variable, and the name is needed inside arm conditions or bodies.

```mj
when get_value() as n {
    is 0 => "zero"
    if n % 2 == 0 => "even"
    else => "other"
}
```

Without `as`, the target expression has no name and is only available implicitly as
the left operand of arm conditions. With `as`, it is available both implicitly and
explicitly by name.

## Arms

Each arm consists of an arm keyword, a condition or pattern, the `=>` operator, and a
body expression. Arms are evaluated in order. The first arm whose condition is
satisfied produces the result. Subsequent arms are not evaluated.

There are four arm keywords: `is`, `in`, `if`, and `else`. Each has a distinct and
non-overlapping role.

### is — Value and Type Pattern Matching

The `is` arm tests whether the target satisfies a value or type pattern. The left
operand of the `is` operator is the target value, supplied implicitly by the `when`
clause.

```mj
when n {
    is 0 => "zero"
    is Dog => n.name
}
```

For type patterns, the compiler narrows the type of the bound name after `=>`. No
explicit cast or destructuring is required — the compiler infers the narrowed type from
the `is` pattern and makes the type's members available in the body.

```mj
when get_value() as n {
    is Dog => n.name      // n is known to be Dog here
    is Animal => n.speak() // n is known to be Animal here
}
```

### in — Range and Collection Membership

The `in` arm tests whether the target is a member of a range or collection. The left
operand is the target value, supplied implicitly.

```mj
when n {
    in range(1, 10) => "small positive"
    in valid_set => "in set"
}
```

### if — Explicit Boolean Escape Hatch

The `if` arm evaluates a full explicit boolean expression. The target value is not
implicitly supplied — the condition must be written out in full using the bound name
from the `as` clause or any other value in scope.

`if` arms are for conditions that are too complex to express as a simple `is` or `in`
pattern, or that require relational operators.

```mj
when get_value() as n {
    if n % 2 == 0 and n < 100 => "small even"
    if n < 0 => "negative"
    if n >= 100 => "large"
}
```

### else — Unconditional Catch-All

The `else` arm matches unconditionally. It must appear last if present. It serves as
the default case when no preceding arm has matched.

```mj
when n {
    is 0 => "zero"
    in range(1, 10) => "small positive"
    else => "other"
}
```

## Negation

Negation is expressed by combining `is` with `not`:

```mj
when n {
    is not null => n.value
    is not Dog => "not a dog"
}
```

## Complete Example

```mj
when get_value() as n {
    is 0 => "zero"
    in (0, 7) => "zero or seven"
    in range(1, 10) => "small positive"
    is Dog => n.name
    is Animal and is not null => n.speak()
    if n % 2 == 0 and n < 100 => "small even"
    if n < 0 => "negative"
    if n >= 100 => "large"
    else => "other"
}
```

## Design Notes

**Arm keyword uniformity.** Every arm begins with a keyword — `is`, `in`, `if`, or
`else`. Relational operators (`<`, `>=`, etc.) are not permitted as leading arm tokens.
Complex conditions involving relational operators belong in `if` arms. This preserves
visual consistency across all arms and makes the structure of a `when` block scannable
at a glance.

**Implicit left operand.** The `is` and `in` operators in arm conditions omit their
left operand, which is supplied implicitly by the `when` clause. This is a syntactic
convenience scoped specifically to arm conditions. It does not apply in `if` arms,
where all operands must be explicit. Compound elided expressions are not supported —
each `is` and `in` arm tests a single pattern. When multiple values need to be matched
with a shared body, use `in` with a tuple: `in (0, 7)`.

**Type narrowing.** After the `=>` of an `is` type pattern arm, the compiler narrows
the type of the bound name to the tested type. This is implicit and requires no
additional syntax. The `as` keyword is reserved for binding the target expression to a
name in the `when` clause, not for introducing type narrowing within arms.

**No fallthrough.** Arms do not fall through. Each arm is self-contained. The `or`
operator within a single arm is the mechanism for matching multiple patterns with a
shared body — it is explicit and intentional rather than implicit as in C.
