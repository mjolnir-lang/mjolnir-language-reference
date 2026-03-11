# Implicitly Typed Variables

Some languages allow local variables to be declared without an explicit type. In statically typed
systems, a keyword (`auto`, `var`, `let`, `const`) or contextual form (`for`) introduces a variable
whose type is inferred from its initializer.

## Summary

### Advantages

- Reduced verbosity in local declarations
- Automatic propagation of type changes during refactoring
- Avoidance of redundant type repetition when the initializer already makes the type explicit
  (e.g., constructor calls)

  This is particularly relevant for long or heavily parameterized type names.

### Disadvantages

- Type information is not locally visible and must be reconstructed from the initializer
- Inferred types may be surprising (e.g., unintended decay, narrowing, or template deduction effects)
- Inferred types must also infer their ownership and lifetime
- Readability depends on the clarity of the initializing expression

### Aesthetic Concerns

- Mixing explicit and implicit declarations often results in inconsistent style and reduced visual
  uniformity

## Design Decision

Mjolnir does not support implicitly typed named variables.

The primary objective is preserving local type visibility. A variable's type should be immediately
apparent at its declaration site, without requiring inspection of its initializer.

The most common motivation for implicit typing is avoiding repetition during initialization.
Mjolnir instead supports destination-type constructor inference. The declared type appears before
the variable name, and the constructor expression may use `new` in place of the type name:

```mj
Array<int> items = new([1, 4, 1, 5])
```

Here, `new` denotes construction of the declared type. It does not imply heap allocation.

This preserves explicit type declarations while eliminating redundant type repetition in
constructor calls.

## Limited Contextual Inference

Implicit typing exists only within constrained expression contexts and does not introduce
implicitly typed named variables.

- **Operator expressions**  
  Operators resolve to explicitly typed methods. Type transformations may occur due to overload
  resolution or template instantiation, but they are confined to the expression and do not produce
  untyped bindings.

- **For-in constructs**  
  The element type is determined by the iterable's interface.

- **Lambda expressions**  
  Parameter and return types are determined by the destination type.

In all cases, type inference is localized, bounded, and does not obscure the type of named program
state.
