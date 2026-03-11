# Mjolnir Language Glossary

Terms are organized from primitive to composed. Composed terms are defined using earlier terms in the glossary and should be read in order on first pass.

---

## Primitive Terms

**Concrete type.** A type with a fully known, statically determined memory layout. All fields, their sizes, and their positions in the record are knowable at compile time without any runtime information.

**Abstract type.** A type defined by an interface — a contract of method signatures that any conforming concrete type must satisfy. The concrete type behind an abstract value is not statically known at the use site. Abstract types are the mechanism for dynamic dispatch and heterogeneous collections in Mjolnir. Every abstract type is a valid concrete type — it is not a fundamentally different category but a concrete type whose dispatch is deferred to runtime. The same type may be used concretely in one context and abstractly in another through the same underlying mechanism.

**Interface.** The language construct that defines an abstract type. An interface declares a set of methods and optionally imposes layout constraints on implementing types, such as requiring them to store a vtable inline in their instance record.

**Record.** The in-memory structure of a type instance. A record consists of fields at fixed or derived offsets. The record layout of a concrete type is fully determined at compile time.

**Owned value.** A value whose lifetime is managed by its current binding. Ownership may be transferred but not duplicated. When an owned value goes out of scope it is destroyed.

**Reference.** A non-owning pointer to a value whose lifetime is managed elsewhere. References may be mutable or immutable. A reference does not affect the lifetime of the value it points to.

**Vtable.** A dispatch table associating an interface's methods with the concrete implementations provided by a specific concrete type. A vtable is specific to a pairing of one concrete type and one interface — it is not a general description of everything a concrete type can do.

---

## Dispatch

**Static dispatch.** Method resolution performed entirely at compile time. The concrete type is known at the call site and the compiler emits a direct call to the correct implementation. No runtime overhead.

**Dynamic dispatch.** Method resolution performed at runtime through a vtable. The concrete type is not statically known at the call site. Requires a vtable lookup and an indirect call.

**Call-site dispatch.** The principle in Mjolnir by which dispatch mode is determined by the argument types at the call site rather than by the function signature. Passing a concrete type produces static dispatch. Passing an abstract type produces dynamic dispatch. The same function definition handles both cases without modification.

**Dispatch annotation.** A declaration at a call site asserting that dispatch over a specific argument is expected to be static or dynamic. The compiler verifies the assertion and emits an error if it is violated. Annotations are defensive declarations, not imperative instructions — they do not change dispatch behavior, only verify it.

---

## References and Pointers

**Thin pointer.** A reference consisting of a single data pointer. Used for concrete types and for abstract types whose interface declares an inline vtable constraint. Dispatch information is either unnecessary (concrete) or reachable through the instance record (inline vtable).

**Fat pointer.** A reference consisting of a data pointer paired with a vtable pointer. The default reference form for abstract types. The vtable travels with the reference because the concrete type is not statically known and may vary per instance.

**Inline vtable.** A vtable stored within an implementing type's instance record rather than carried alongside a reference. Declared as a layout constraint on the interface. Enables thin pointer references to abstract values. Each instance carries its own vtable independently, making dispatch reachable through the data pointer alone.

---

## Generic Types

**Generic type.** A type definition parameterized over one or more type arguments. The memory layout of a specialization is determined entirely by the type arguments. No information about the generic definition itself is present at runtime — only the specialization exists.

**Generic parameter.** A placeholder in a generic definition resolved to an argument at the point of specialization. Generic parameters are ordinary parameters — they are not a distinct category of language entity. Mjolnir supports two kinds: generic type parameters and generic value parameters.

**Generic type parameter.** A generic parameter whose argument is a type. May be constrained by one or more interfaces, making the interface's methods available on values of the parameter within the definition. An unconstrained generic type parameter accepts any type.

**Generic value parameter.** A generic parameter whose argument is a compile-time value. Valid arguments are values whose type is convertible to a primitive — integers, booleans, and enum variants. The compiler uses value arguments as specialization keys to produce distinct specializations for each distinct value.

**Generic argument.** The value supplied to a generic parameter at the point of specialization. Generic arguments fully determine the specialization.

**Generic type argument.** A generic argument that is a type — concrete or abstract — supplied to a generic type parameter.

**Generic value argument.** A generic argument that is a compile-time value supplied to a generic value parameter. Must be convertible to a primitive.

**Type parameter.** A placeholder in a generic type definition standing in for a type argument supplied at specialization time. See generic type parameter.

**Specialization.** The instantiation of a generic definition with specific generic arguments. A specialization is a distinct type — `Container<PoolAllocator>` and `Container<Allocator>` are different types with no implicit relationship.

**Concrete specialization.** A specialization of a generic type where the relevant type parameter is resolved to a concrete type. Produces inline homogeneous storage, static dispatch, and thin pointer references for that parameter.

**Abstract specialization.** A specialization of a generic type where the relevant type parameter is resolved to an abstract type. Produces heap allocated owned values, dynamic dispatch, fat or thin pointer references depending on the interface, and permits heterogeneous elements at that parameter position.

---

## Storage and Layout

**Fixed size annotation.** A declaration on an abstract type parameter that bounds its maximum inline size. Permits inline value storage of abstract parameters in a record by reserving a fixed footprint. Without this annotation abstract parameters may only be stored by reference. The only sanctioned form of inline value storage for abstract parameters.

**Homogeneous.** A collection or record position where all values are of the same concrete type. Concrete specializations are homogeneous by construction. Abstract specializations permit heterogeneity but do not require it.

**Heterogeneous.** A collection or record position where values may be of different concrete types, all conforming to a shared abstract type. Only possible under abstract specialization.

**Read-only constraint.** The requirement that a type parameter appears only in output positions of a type's public API — returned from methods but never accepted as input. Ensures that values of the parameter type flow outward only, making it impossible to introduce a new concrete type through the API after specialization. This constraint is what makes abstract specialization compatibility and constructor-based casting between specializations sound.

---

## Abstract Specialization Compatibility

**Abstract specialization compatibility.** The property of a generic type over a specific parameter where the memory representation is identical between the concrete specialization and the abstract specialization. When this property holds, a reference to a concrete specialization may be reinterpreted as a reference to the abstract specialization at zero cost. Abstract specialization compatibility is the intersection of memory representations valid for both specialization forms simultaneously — it is neither derived from the concrete form nor imposed by the abstract form, but is the set of layouts where both forms agree.

**Layout stable coercion.** The zero-cost reinterpretation of a reference to a concrete specialization as a reference to the corresponding abstract specialization, valid when the generic type is abstract specialization compatible over that parameter. No data is moved or copied. Both mutable and immutable references are eligible. The cost of this operation is zero because the memory representations are identical — the compiler changes only its interpretation of the reference, not the memory it points to.

**Homogeneity under abstract specialization compatibility.** When a type is abstract specialization compatible over a parameter, all values at that parameter position within a single instance will be of the same concrete type. This is a natural consequence of the read-only constraint — because the parameter type never appears as an input to the public API, no path exists through which a value of a different concrete type could be introduced after the initial specialization. It is not a constraint the developer needs to enforce.

**Flat vtable layout.** The compiler representation of a vtable for a concrete type implementing a named interface hierarchy, where all method entries from the entire subtree are laid out in a single flat record with each interface's section at a known fixed offset. Dispatch through any interface in a natural hierarchy is a single vtable hop — the compiler knows all offsets statically and no runtime traversal is required. Casting to a parent interface is a static offset adjustment within the same record at zero additional cost. Generated for named interface declarations, not for type alias constraints.

**Canonical interface ordinal.** A globally unique integer assigned to each interface at link time, enabling direct lookup of orthogonal interface vtables — interfaces with no common ancestor and therefore no shared flat vtable record.

**Multi-interface constraint.** A generic type parameter constrained to implement more than one interface simultaneously, declared with the `+` operator — for example `Ordered + Serializable T`. For interfaces within a named hierarchy, dispatch uses the flat vtable layout with static offsets. For orthogonal interfaces expressed through a `+` constraint or type alias, dispatch uses an inline vtable pointer array in the fat pointer.

**Type alias constraint.** A named abbreviation for a combination of interface constraints, declared with the `type` alias syntax. Introduces no new type and carries no semantic weight beyond abbreviating the `+` syntax. Uses of a type alias constraint resolve to multi-hop dispatch. Distinct from a named interface hierarchy, which introduces a new semantic type and generates a flat vtable.

```
type OrderedSerializable<type T, type U> = Ordered<U> + Serializable<T>
```

---

## Annotations and Contracts

**Annotation.** A compiler directive prefixed with `@` that attaches a contract, assertion, or declaration to a definition or call site. Annotations use the form `@annotation(...)`. They are not imperative instructions — they declare properties the compiler verifies rather than actions the compiler performs.

**Where clause.** An annotation of the form `@where(...)` that prefixes a function or method prototype. `@where` is a compile-time constraint — all expressions inside it must be resolvable at compile time. Type property checks use the `is` keyword and resolve to Boolean at compile time — for example, `T is Ordered`. Value expressions must be statically known. Boolean operators are spelled `and`, `or`, and `not`. The where clause may express interface constraints on generic parameters, relationships between parameters, and any other compile-time Boolean condition that must hold at the call site. Type constraints in the where clause and inline constraints on generic parameters are equivalent. Value range and other runtime conditions are handled explicitly in the function body.

**Dispatch annotation.** An annotation asserting that dispatch over a specific argument at a call site is expected to be static or dynamic. The compiler verifies the assertion and emits an error if it is violated. Dispatch annotations are defensive declarations — they verify dispatch behavior rather than change it.

**Partial abstract specialization.** A specialization of a generic type in which one or more type parameters are resolved to abstract types while others remain concrete or unresolved. The resulting type is itself generic over the remaining parameters. A vtable is constructed for the partially abstract form, covering all methods — public and internal — whose behavior depends on the abstract parameter. This vtable captures the dispatch surface introduced by the abstract parameter independently of the remaining parameters.

Partial abstract specialization is most naturally applicable to generic types with orthogonal parameters — parameters that appear in disjoint sets of methods and do not interact in the record layout. In this case the vtable for the abstract parameter can be constructed cleanly without entangling the remaining parameters. When parameters interact in the layout or share methods, the vtable construction becomes difficult to isolate and the pattern is less applicable.

Partial abstract specialization was an early approach to the problem of abstracting over one parameter of a multi-parameter generic type — for instance, abstracting over the allocator parameter of a container while leaving the element type concrete. Abstract specialization compatibility is the more general solution to this problem and supersedes partial abstract specialization in most cases. Partial abstract specialization remains available as a distinct mechanism for cases where the orthogonality condition is clearly satisfied and a vtable over the abstract parameter is the desired result.

---

## Casts and Constructors

**Type cast.** In Mjolnir, all type casts are constructor calls. Casting a value to a different type invokes the constructor of the target type with the source value as its argument. There is no implicit reinterpretation of owned values — a cast always produces a new value through a constructor.

**Constructor cast from concrete to abstract specialization.** A type cast that converts a concrete specialization to an abstract specialization by invoking the abstract specialization's constructor with the concrete specialization as its argument. The constructor moves or copies elements from the concrete form into the abstract memory model. This applies even when the type is abstract specialization compatible — although the memory layouts are identical, the type contract changes from concrete to abstract and a constructor call is the correct expression of that change. Zero-cost coercion is reserved for references. For types whose memory layout the compiler fully controls, this constructor is generated automatically. For types that manage their own memory, the type author provides it explicitly.

---

## Ownership and Lifetime

**Move semantics.** The transfer of ownership of a value from one binding to another. After a move the original binding is invalid. Move semantics are a first-class property of initialization in Mjolnir — the compiler tracks ownership through initialization and transfer rather than through a separate move annotation system.

**Initialization.** The establishment of a valid owned value at a binding site. All owned values must be initialized before use. Initialization is the primary site at which ownership is established and move semantics are expressed.
