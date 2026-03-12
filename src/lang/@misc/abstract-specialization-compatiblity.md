# Layout Equivalence and Generic Instantiation

## Overview

Generic types in Mjolnir can be instantiated over concrete types or abstract types. The memory layout of the resulting type follows directly from the argument type using standard language rules — no special annotations or opt-ins are required. Under certain conditions a concrete instantiation and an abstract instantiation produce identical memory layouts. This property is called **layout equivalence**, and it is the foundation on which layout stable coercion rests.

---

## Normal Instantiation

Instantiating a generic type follows the same rules regardless of whether the argument is a concrete type or an abstract type. The memory model is a direct consequence of the argument.

A concrete argument produces inline homogeneous storage with statically known layout. Dispatch is static. References are thin pointers. There is no vtable and no allocation overhead beyond what the type's own definition requires.

An abstract argument produces heap allocated owned values. Dispatch is dynamic. References are fat pointers. Elements may be heterogeneous — any conforming concrete type may appear at the parameter position within the same instance.

These are not distinct features or modes. They are the same instantiation mechanism applied to different argument types, producing naturally different memory models as a consequence of what those argument types mean in the language.

### Value Storage Restriction

Abstract parameters may not be stored by value in a generic type's record unless annotated with a fixed size. An unsized inline abstract value has no statically knowable footprint, which would make the containing record's size indeterminate. The fixed size annotation is the only sanctioned form of inline value storage for abstract parameters and applies uniformly across all instantiation forms without exception. All other storage of abstract parameters must be by reference.

---

## Reference Representation of Abstract Parameters

The reference representation used for an abstract parameter in a generic type is not a choice made at the generic type level. It is inherited directly from the reference representation of the interface that defines the abstract type.

By default, abstract references are fat pointers — a data pointer paired with a vtable pointer specific to the concrete type and interface being dispatched through. The vtable must travel with the reference because the concrete type of each value is independent and only knowable at the point where the reference was formed. In a heterogeneous container each element has its own fat pointer reference carrying its own vtable, and there is no single representative vtable that could serve all elements.

This is the limiting factor for layout equivalent types. Because the generic type uses the abstract parameter's reference representation, and the abstract form requires fat pointers by default, the concrete instantiation of a layout equivalent type also uses fat pointers for that parameter. The vtable field is present but unused in the concrete case — this is the cost of layout compatibility between the two instantiation forms.

An interface may instead declare that all implementing types must store the vtable within their own instance record. Under this constraint abstract references are thin pointers — a single data pointer suffices, since following it into the record always leads to the vtable. Each instance carries its own vtable independently, so dispatch is always reachable regardless of concrete type. Heterogeneous containers work correctly under this model because the vtable is per-instance in the record rather than per-reference.

When a generic type is parameterized over such an interface, it inherits thin pointer references for that parameter automatically. Both the concrete and abstract instantiation forms use thin pointers, and neither pays fat pointer overhead. The benefit flows through naturally from the interface definition without any additional annotation on the generic type itself.

---

## Layout Equivalence

Layout equivalence is the property of a generic type over a specific parameter where the memory representation is identical regardless of whether that parameter is resolved to a concrete type or an abstract type. It is not a top-down or bottom-up design decision. It is the intersection of representations that are valid for both instantiation forms simultaneously.

A type that satisfies layout equivalence can be instantiated with either a concrete or abstract argument and produce the same layout in both cases. This makes zero-cost reinterpretation between the two instantiation forms possible.

### Constraints

The following conditions must hold for all parts of the type's layout that are reachable through the coerced API surface. Fields or stored values that are entirely unreachable from any public method on the abstract form are not subject to these constraints — a violation in an unreachable part of the layout is inert and does not affect the validity of layout equivalence. The compiler verifies reachable layout at the annotation site and emits a compile error only where a constraint is violated and the violating part is accessible.

**Fixed footprint in the record.** The parameter must appear in the type's record only in forms with a fixed known size — either by reference, or by value with a fixed size annotation. This is a universal restriction on abstract parameter storage and applies regardless of whether layout equivalence is desired.

**Vtable availability.** The vtable must be reachable through the parameter's reference representation for every stored value of the abstract parameter type. This is automatically satisfied by using the parameter's own reference form — fat pointer references carry the vtable alongside each reference, and thin pointer references to types with inline vtables carry the vtable in the instance record. No additional constraint on the generic type is required beyond using the reference form the interface defines.

**API surface over the abstract form must be layout compatible.** Any API that exposes the parameter through the abstract form must satisfy the output-only constraint — the parameter type may only appear in output positions and must never appear as an input parameter to any public method. Methods that take the parameter as input are permitted provided they are not accessible through the abstract form. If an input-taking method would be visible through the abstract form, it must be excluded from the coerced API surface for coercion to be valid.

### Homogeneity

When a type is layout equivalent over a parameter, all values at that parameter position within a single instance will be of the same concrete type. This is not a constraint the developer needs to guard against — it is a natural consequence of the output-only API requirement. Because the parameter type never appears as an input to the public API, there is no path through which a value of a different concrete type could be introduced after the initial instantiation. The concrete type is fixed at instantiation time and cannot change, regardless of whether the type was instantiated directly with a concrete argument, directly with an abstract argument, or obtained through layout stable coercion.

---

## Conversions at the Layout Boundary

### Layout Stable Coercion

When a type is layout equivalent over a parameter, a reference to a concrete instantiation may be reinterpreted as a reference to the abstract instantiation. The memory is identical, no data is moved or copied, and the cost is zero. Both mutable and immutable references are eligible. This is the direct reward for satisfying layout equivalence — the two instantiation forms are interchangeable by reference at no runtime cost.

Coercion between two abstract instantiations of the same generic type is not valid, even when the source interface implements the target interface. Each fat pointer carries a vtable reference specific to the interface it was constructed for. Reinterpreting the reference as a different abstract instantiation would leave each element's vtable pointing at the wrong dispatch table. Promoting an abstract instantiation to a more general abstract instantiation requires a constructor-based cast rather than a zero-cost coercion.

### Constructing from a Concrete Instantiation

A concrete instantiation may be converted to an abstract instantiation through a type cast, which in Mjolnir is always a constructor call. Casting `Container<ConcreteAllocator>` to `Container<Allocator>` invokes a constructor on `Container<Allocator>` that accepts a `Container<ConcreteAllocator>` as its argument. The constructor moves or copies each element from the concrete form into the abstract form, performing whatever restructuring is needed to satisfy the abstract memory model.

This applies even for layout equivalent types. Although the memory layouts are identical, the type contract changes from concrete to abstract at the cast site — the resulting value makes no guarantee about which concrete type it holds. A constructor call is the correct expression of this change in contract, and the copy it performs is the price of that transition. Zero-cost coercion is reserved for references, where the contract change is implicit in the reference form and no owned value is produced.

For types whose memory layout the compiler fully controls, this constructor can be generated automatically. For types that manage their own memory, the type author provides the constructor explicitly. In both cases it is an ordinary constructor — there is no special language mechanism involved beyond the normal type cast syntax.

The same output-only API constraint applies. The parameter type must appear only in output positions of the public API, ensuring that the constructor only needs to move values outward from the concrete form into the abstract form and never needs to reconstruct a concrete type from an abstract type.

---

## What Layout Equivalence Is Not

Layout equivalence is not a subtype relationship. `Container<PoolAllocator>` is not a subtype of `Container<Allocator>`. The two types remain distinct and invariant with respect to each other in the type system. Subtyping in Mjolnir comes exclusively from interface implementation.

Layout equivalence is also not a special memory model. It is the subset of the normal instantiation memory model where the concrete and abstract forms happen to agree. A type that opts in uses the abstract parameter's reference representation and satisfies the reachable layout constraints — it is otherwise using the same mechanisms as any other generic type.

---

## Summary

| Property | Concrete Argument | Abstract Argument | Layout Equivalent |
|---|---|---|---|
| Element storage | Inline | Heap allocated | Inline |
| Homogeneity | Homogeneous | Heterogeneous | Naturally homogeneous |
| Dispatch | Static | Dynamic | Static or dynamic |
| Reference form | Thin pointer | Derived from interface | Derived from interface |
| Vtable location | None | In reference or in record | In reference or in record (unused in concrete form if fat ptr) |
| Layout identical between forms | — | — | Yes |
| Zero-cost coercion eligible | No | No | Yes |
| Cast to abstract instantiation | Yes (source) | — | Yes (source) |
| Cast from abstract instantiation | — | Yes (target) | Yes (target) |
| Opt-in annotation required | No | No | Yes |
