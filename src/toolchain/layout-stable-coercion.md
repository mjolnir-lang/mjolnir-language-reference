# Layout Stable Coercion and Layout Transforming Conversion

## Overview

Generic types in Mjolnir are invariant over their type arguments. `Container<PoolAllocator>` and `Container<Allocator>` are distinct types with no subtype relationship between them. In general this is the correct and safe behavior — changing a type argument can change the memory layout of the containing type, and permitting implicit conversions between them would be unsound.

Mjolnir provides two mechanisms for promoting a generic type to a more general form over a specific parameter. They differ in what they produce and what they require of the type's layout.

- **Layout stable coercion** — a zero-cost reinterpretation of an immutable reference when the two instantiations have identical memory representations
- **Layout transforming conversion** — a structural transformation that produces a new owned value in the more general form, permitting a different layout between the two instantiations

---

## Motivation

Consider a container parameterized over an allocator type. Most functions that operate on a container — sorting, searching, transforming — have no interest in the allocator. They work with the container's contents and never touch allocation at all. Yet without some mechanism to abstract over the allocator argument, every such function must either be generic over the allocator type or commit to a specific one.

Being generic over the allocator is correct but has a cost. For large functions with complex control flow the compiler may generate a separate instantiation for every distinct allocator type, duplicating code that is identical in all but the allocator dispatch path. For standard library functions intended to work with any container this is particularly wasteful.

Both mechanisms below address this problem. Which one applies depends on the layout of the specific type and how the caller intends to use the result.

---

## Layout Stable Coercion

Layout stable coercion permits an immutable reference to `Container<ConcreteAllocator>` to be reinterpreted as an immutable reference to `Container<Allocator>`. The reference is not copied or converted — the memory is identical and the compiler simply treats it as the more general type. The caller can then pass this reference to any function expecting `Container<Allocator>` without any runtime cost.

### Requirements

The compiler verifies all of the following conditions when the layout stable annotation is declared on a type parameter. A compile error is emitted at the annotation site if any condition is not satisfied.

**Fixed footprint in the record.** The parameter must appear in the containing type's record only in forms with a fixed known size. The permitted storage forms are:

- By reference — only the reference itself occupies space in the record, which has a fixed size regardless of the referent
- By value with a fixed size interface annotation — the inline size annotation guarantees a fixed footprint in the record

A bare concrete value stored directly in the record is not permitted. Its size is statically known at instantiation time but would differ from the interface form, breaking layout compatibility.

**Vtable availability.** For each occurrence of the parameter in the record, the vtable must be retrievable alongside the instance. This is satisfied either by storing a vtable reference alongside the instance in the record, or by the interface inlining the vtable into the instance's own record via a layout constraint. In the static dispatch case the vtable may be present but unused — this is the cost of layout compatibility.

**Output-only in the public API.** The parameter type may only appear in output positions of the type's public API. It must never appear as an input parameter to any public method. This follows from the one-way nature of type erasure — a concrete type can always be erased to an interface, but the reverse requires information the compiler does not have. When surfaced through the API the parameter must be returned as a dynamic type, either a dynamic reference or a dynamic owned value such as a clone or a move. External code may independently perform a dynamic cast on a returned dynamic value to recover the concrete type — this is outside the generic type's concern and does not affect the validity of the annotation.

**Reference mutability must be consistent with the API surface.** Layout stable coercion is permitted for a given reference form only if the corresponding API surface satisfies the output-only constraint. For many types both mutable and immutable references will be eligible. However, if a type's mutable API exposes the parameter as an input — for instance a method that replaces the allocator — then mutable references are not eligible for coercion, because a caller holding a coerced mutable reference could mutate the parameter field in ways that violate the concrete instantiation's invariants. The immutable reference form of the same type may still be eligible if the immutable API satisfies the output-only constraint independently. Coercion is permitted for whichever reference forms qualify.

---

## Layout Transforming Conversion

Layout transforming conversion addresses the same problem as layout stable coercion but without requiring identical memory representations between the two instantiations. Instead of reinterpreting a reference, it produces a new owned value in the more general form by structurally transforming the original.

This is more flexible than layout stable coercion because the vtable does not need to be present in the original layout — the transformation can assemble the necessary dispatch information during conversion. A container that does not store its allocator in a layout stable form can still be promoted to the interface form of its allocator parameter, at the cost of the transformation itself.

The same constraints apply regarding the parameter's API surface — it may only appear in output positions and must be surfaced as a dynamic type. The immutability constraint does not apply because the result is a new owned value rather than a reinterpreted reference. Mutation of the new value does not affect the original.

The transformation may be simple or involve significant work depending on the type's layout. The compiler generates the transformation from the type definition and the layout stable annotation. The programmer does not implement it manually.

---

## Shared Vtable Slot Optimization

When a layout stable parameter appears multiple times in a type's record, the vtable would normally be stored alongside each occurrence — one vtable reference per field. Since all occurrences share the same type argument and therefore the same vtable, this is redundant. Mjolnir permits an annotation that designates a single vtable slot in the primary record to be shared across all occurrences of that parameter.

This optimization is only applicable when the vtable is not already accessible through the instance reference itself — that is, when the interface does not inline the vtable into its instance record. If the vtable is inlined into the instance, it is already retrievable through a single reference to the instance and no separate slot is needed.

When the shared vtable slot is used, the programmer specifies its position in the record. Placing it at the beginning or end of the record is conventional and keeps the layout predictable, but the language does not mandate a position. The compiler uses the declared position to locate the vtable whenever dynamic dispatch is required through the coerced form.

The benefit is a flat vtable storage cost regardless of how many times the parameter appears in the record. This lowers the overhead of layout stable coercion for types with multiple fields of the same parameter type, and broadens the range of custom types that can participate in the feature without significant layout cost.

---

## Allocators as the Canonical Example

The allocator parameter in Mjolnir's standard library container types is the primary use case for these features. The standard library allocator interface is designed specifically to satisfy layout stable coercion requirements:

- The allocator interface inlines its vtable directly into the instance record via a layout constraint. This is the appropriate choice because allocators are always stored by reference within container records — the vtable is what is truly needed alongside the reference, and inlining it into the allocator's own record avoids the need for a separate vtable pointer in the container
- The global allocator is a singleton with a real address rather than a zero-sized type, ensuring it occupies the same space as any other allocator in the container record
- The allocator never appears as an input parameter in the container's public API — it may be returned as a dynamic reference or dynamic owned value, but the caller cannot supply a new allocator through the public API
- Container types annotate their allocator parameter as layout stable, enabling immutable reference coercion between any concrete allocator instantiation and the interface form

The result is that standard library functions and large application functions can accept immutable `Container<Allocator>` references and work correctly with any container regardless of its allocator, without requiring the programmer to think about allocator types at all.

---

## What These Are Not

Neither layout stable coercion nor layout transforming conversion is a subtype relationship. `Container<PoolAllocator>` is not a subtype of `Container<Allocator>`. The two types remain distinct and invariant with respect to each other in the type system.

Subtyping in Mjolnir comes exclusively from interface implementation. These features are separate and narrower concepts justified entirely by verifiable representation guarantees and do not interact with or imply anything about the broader type hierarchy.

---

## Summary

| Property | Layout Stable Coercion | Layout Transforming Conversion |
|---|---|---|
| Result | Immutable reference reinterpretation | New owned value |
| Layout requirement | Identical representation | May differ |
| Vtable requirement | Must be present in original layout | Assembled during conversion |
| Mutability | Whichever reference forms whose API satisfies output-only constraint | Owned value, no restriction |
| Cost | Zero | Transformation cost |
| API restriction | Output positions only | Output positions only |
| Verification | Compile time | Compile time |
| Relationship to subtyping | None | None |
