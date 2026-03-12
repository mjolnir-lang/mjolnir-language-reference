# Interfaces, Dispatch, and Memory Management

## Overview

Mjolnir unifies two concepts that most languages treat as separate concerns: static dispatch across concrete types and dynamic dispatch through interfaces. The design goal is that a programmer should be able to write a single function and have the compiler select the appropriate dispatch strategy based on what is passed at the call site, rather than requiring the programmer to pre-annotate functions or types with dispatch intent.

---

## Classes and Interfaces

Mjolnir uses two fundamental type categories:

- **Classes** are concrete types with a fully known layout and implementation at compile time.
- **Interfaces** describe a contract — a set of capabilities — that a class may implement. An interface may also impose layout constraints on its implementers.

This distinction maps to what other languages call structs/traits or classes/protocols. The terminology is intentionally plain. An interface is just an interface. A class is just a class.

Interfaces in Mjolnir are more powerful than in most languages. In addition to declaring methods, an interface can constrain the memory layout of any class that implements it. This enables safe low-level interoperability and predictable ABI behavior where needed.

---

## Call-Site Dispatch

In most languages, dispatch mode is a property of the function. A function is either virtual, generic, or concrete, and callers adapt to that decision. Mjolnir inverts this.

Functions in Mjolnir are **generic over their arguments**. When a function is called, the compiler instantiates it for the specific argument types provided. What varies between instantiations is not the function itself, but what happens inside it when calls are made through interface-typed arguments.

- If an argument is a class — a concrete, fully known type — the compiler monomorphizes the instantiation for that type. Calls made through that argument are resolved statically. The compiler can inline, optimize, and specialize freely.
- If an argument is an interface type, the compiler instantiates the function with that interface as the argument type. Calls made through that argument dispatch dynamically at runtime, because the concrete type behind the interface is not statically known.

The function definition is the same in both cases. The difference is in how the compiler instantiates it and what the generated code does at the points where the argument is used.

This means the boundary between static and dynamic dispatch is determined by the types at the call site — specifically, by whether the programmer is passing a concrete class or an interface value. The programmer does not annotate the function to declare which dispatch mode it uses. That falls out naturally from what is passed.

### Why This Matters

In languages like C++ or Rust, a programmer must decide upfront whether a function will be dispatched statically (templates, generics) or dynamically (virtual functions, `dyn Trait`). Changing that decision later requires rewriting signatures and potentially call sites. Mjolnir eliminates this upfront commitment. A function written against an interface works correctly whether the caller provides a concrete class or an interface value, and the compiler generates the appropriate instantiation automatically.

---

## Interface Values and Ownership

When an interface is used as a type directly, it produces an **interface value** — a value whose concrete type is not statically known but which is guaranteed to satisfy the interface contract.

Ownership of interface values follows the same rules as ownership of any other value in Mjolnir:

- Passing an interface value by value transfers ownership. The receiving scope is responsible for destruction.
- Borrowing an interface value produces an immutable or mutable reference, just as with any class.
- When an owned interface value goes out of scope, its destructor is called and its memory is reclaimed.

There is no special ownership model for interface values. The distinction between owning and borrowing an interface is handled by the same ownership system that governs all types. This uniformity is intentional — a programmer should not need to think differently about ownership just because they are working through an interface.

A borrowed interface value retains full dispatch capability. The compiler carries both the data reference and the dispatch information together, so dynamic dispatch works correctly through borrows as well as owned values.

---

## Dispatch Annotations

Because dispatch mode is derived from argument types rather than function signatures, it is possible for dynamic dispatch to propagate through a call chain in ways that are not immediately obvious. A function that accepts an interface value and calls other functions internally will cause those inner calls to dispatch dynamically as well, even if the programmer intended them to be static.

For most code this is the correct and expected behavior. However, at performance-critical boundaries, a programmer may want a compiler-enforced guarantee that a particular call or function is statically dispatched.

Mjolnir provides **dispatch annotations** for this purpose. An annotation at a function definition or call site instructs the compiler to verify that the dispatch mode meets the specified constraint, and to emit an error if it does not.

These annotations are **defensive, not imperative**. They do not change how dispatch works. They assert an expectation and let the compiler catch violations. Code without annotations behaves exactly as the call-site dispatch rules describe. Annotations are for programmers who want an explicit guarantee at known boundaries — particularly at the edges of performance-sensitive subsystems.

---

## Memory Allocation for Interface Values

Interface values whose concrete type is not statically known require storage for whichever concrete class ends up behind them. Since the size of that class is not known at compile time in the general case, Mjolnir must allocate storage for it separately from the interface value's record, which contains only the information needed to access and dispatch through the interface.

By default, this backing allocation uses the **global allocator** for the target platform. This is the expected and correct behavior for most usage. Programmers who use interface values are already accepting the semantics of runtime polymorphism, and dynamic allocation is consistent with that choice.

Mjolnir provides two annotations on interface definitions to modify this behavior:

### Max-Size Inline Annotation

An interface may be annotated with a maximum size. If annotated, interface values of that interface are stored inline — no heap allocation occurs. The concrete class must fit within the declared size, and the compiler enforces this. If an implementing class exceeds the size, it is a compile error.

This is the zero-allocation path for interface values. It is appropriate when the set of implementing classes is known and bounded, and when allocation overhead is unacceptable. The tradeoff is that the interface definition must commit to a size, and future implementations are constrained by it.

### Allocator Annotation

An interface may be annotated with a specific allocator. All owned instances of that interface will use the specified allocator for their backing storage rather than the global allocator. This is appropriate when an interface is expected to be used in a particular memory access pattern — for example, routing all instances of a specific interface through a pool allocator when instances are expected to be short-lived and frequently created and destroyed.

If no annotation is present, the global allocator is used. Most interfaces should not need this annotation.

### Containers of Interface Values

A container of owned interface values — such as a vector of interface types — stores the interface records contiguously, but the backing implementations are allocated separately through the interface's allocator and may be scattered in memory. This is an expected consequence of runtime polymorphism and dynamic allocation.

Programmers who require strict cache locality for a polymorphic collection should be aware of this tradeoff. The performance characteristics of iterating over a container of interface values are similar to pointer-chasing through a linked structure — not cache-hostile by accident, but by the nature of storing variable-sized types whose concrete layout is not known until runtime. This is a documented limitation rather than a deficiency, and it is consistent with the overhead that dynamic dispatch already implies.

---

## Summary of Defaults

| Scenario | Default Behavior |
| --- | --- |
| Function called with class arguments | Static dispatch, monomorphized |
| Function called with interface arguments | Dynamic dispatch |
| Owned interface value | Heap allocated via global allocator |
| Borrowed interface value | No allocation, borrows existing storage |
| Interface with max-size annotation | Inline storage, no heap allocation |
| Interface with allocator annotation | Heap allocated via specified allocator |
| Container of interface values | Records contiguous, implementations heap allocated |
