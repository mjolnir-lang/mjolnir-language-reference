# Generics

Mjolnir supports generics over types, functions, methods, and interfaces. A generic definition is parameterized over one or more generic parameters that are resolved to arguments at the point of use. The behavior and memory model of the resulting specialization follow directly from the argument types provided — no special annotations or modes are required.

A foundational principle of Mjolnir's type system is that every abstract type is a valid concrete type. An abstract type is not a fundamentally different category — it is a concrete type whose dispatch is deferred to runtime rather than resolved at compile time. The same type may be used concretely in one context and abstractly in another, and the language handles both through the same underlying mechanism. The distinction between concrete and abstract is a property of how a type is used at a given site, not a property of the type itself.

---

## Generic Parameters

A generic parameter is a placeholder in a generic definition resolved to an argument at the point of specialization. Generic parameters are ordinary parameters — they are not a distinct category of language entity but simply parameters whose arguments are supplied at compile time rather than at runtime.

Mjolnir supports two kinds of generic parameter.

### Generic Type Parameters

A generic type parameter stands in for a type argument. Type parameters may be constrained by interfaces. A constraint is declared by prefixing the parameter name with the interface name. An unconstrained type parameter is declared with the `type` keyword, indicating it accepts any type. The `class` keyword restricts to concrete types only. The `interface` keyword restricts to abstract types only.

```
// Unconstrained — accepts any type
T identity<type T>(T x) { ... }

// Constrained to a single interface
T max<Ordered T>(T a, T b) { ... }

// Constrained to multiple interfaces
T process<Ordered + Serializable T>(T a) { ... }

// Restricted to concrete types only
T create<class T>() { ... }

// Restricted to abstract types only
void wrap<interface T>(T value) { ... }
```

### Generic Value Parameters

A generic value parameter stands in for a value argument. Valid generic value arguments are values whose type is convertible to a primitive — integers, booleans, and enum variants. This boundary ensures that the compiler can use value arguments as specialization keys: they are comparable and have no runtime identity beyond their value.

Enum variants are a natural fit for generic value arguments. They are named compile-time constants that reduce to integer values, and using them as generic arguments produces distinct specializations with readable names rather than opaque integer literals.

```
class Buffer<EncodingKind Encoding> {
    ...
}

Buffer<Encoding.UTF8> utf8_buf = Buffer<Encoding.UTF8> { ... };
Buffer<Encoding.ASCII> ascii_buf = Buffer<Encoding.ASCII> { ... };
```

`Buffer<Encoding.UTF8>` and `Buffer<Encoding.ASCII>` are distinct types. The encoding is selected entirely at compile time with no runtime tag and no branch.

Generic type parameters and generic value parameters may appear together in the same definition in any combination.

### Specialization Distinctness

Generic parameters are resolved at specialization time and the resulting specialization is a distinct type. `Container<PoolAllocator>` and `Container<Allocator>` are different types, as are `Buffer<Encoding.UTF8>` and `Buffer<Encoding.ASCII>`. There is no implicit relationship between specializations of the same generic definition over different arguments.

---

## Generic Types

A generic type is a type definition parameterized over one or more generic parameters. The memory layout of a specialization is determined entirely by the type arguments. No information about the generic definition itself is present at runtime — only the specialization exists.

```
class Stack<type T> {
    T[] data;
    Int top;
}
```

A concrete type argument produces a specialization with inline homogeneous storage, statically known layout, and thin pointer references. An abstract type argument produces a specialization with heap allocated owned values, dynamic dispatch, and fat or thin pointer references depending on the interface's reference representation.

A generic type may declare abstract specialization compatibility over a parameter, enabling zero-cost coercion between its concrete and abstract specializations. See the abstract specialization compatibility document for the conditions and constraints.

### Multiple Parameters

A generic type may have any number of type parameters. Each parameter is resolved independently at specialization time. Parameters are orthogonal by default — the memory model of each parameter position follows from its own argument without reference to the others.

```
class Map<type K, type V> {
    K[] keys;
    V[] values;
}
```

---

## Abstract Types as Owned Values

When an abstract type is used directly as a value type, it implies an owned boxed value — heap allocated, with dispatch information accessible through the box. There is no need to write an explicit box or pointer wrapper to obtain an owned abstract value. Writing `Animal` as a type means an owned heap allocated instance of some concrete type implementing `Animal`.

A reference to an abstract value is `Animal&` — a fat or thin pointer depending on the interface's vtable storage declaration. The direct type name implies ownership and heap allocation. The reference form implies borrowing without allocation.

---

## Generic Functions

A generic function is parameterized over one or more type parameters. The function body is written against the constraints of the parameters and is valid for any argument types that satisfy those constraints.

```
T max<Ordered T>(T a, T b) {
    if (a > b) return a; else return b;
}
```

Dispatch for a generic function is determined by the argument types at the call site. Passing concrete types produces a monomorphized specialization of the function with static dispatch throughout. Passing abstract types produces a version operating through dynamic dispatch. The function definition is written once and handles both cases — the caller's argument types determine the dispatch mode, not the function signature.

### Shorthand Generic Functions

Generic functions have a shorthand form where abstract types in input parameter positions implicitly become independent generic type parameters constrained by that interface. This avoids explicit generic parameter declarations for the common case where flexible input specialization is desired without additional constraints between parameters.

```
Int process(Animal x)
// equivalent to
Int process<Animal T>(T x)
```

Each occurrence of an abstract type in an input parameter position becomes an independent implicit generic type parameter, regardless of repetition. Two parameters typed as the same abstract type produce two independent parameters — no relationship between them is implied.

```
Int combine(Animal x, Animal y)
// equivalent to
Int combine<Animal T, Animal U>(T x, U y)
```

Abstract types nested within generic type arguments in input parameter positions also become implicit generic type parameters recursively. Every abstract type at every level of nesting introduces its own independent implicit generic parameter. The nesting structure is preserved in the resulting explicit form.

```
Animal first(List<Animal> list)
// equivalent to
Animal first<List L, Animal T>(L<T> list)
```

Here both `List` and `Animal` are abstract types, so both introduce independent implicit generic parameters. `L` is constrained to `List` and `T` is constrained to `Animal`, composed as `L<T>` to preserve the nesting. The function accepts any value whose type satisfies this structure — including `List<Dog>`, `ArrayList<Cat>`, and `List<Animal>` itself, since abstract types are valid concrete instances and satisfy their own interface constraints.

**Return types** always fall back to the abstract form. The function makes no claim about which concrete type it returns — only that it satisfies the interface. The return value carries dynamic dispatch and the abstract memory model per the interface's reference representation.

```
Animal find(List<Animal> list, Int index)
// equivalent to
Animal find<List L, Animal T>(L<T> list, Int index)
// return type is Animal — abstract, not T
```

If the return type must be the same concrete type as an input parameter — a stronger contract — explicit generic parameter syntax is required and the return type must be named explicitly.

```
T identity<Animal T>(T x)
// cannot be expressed as shorthand
```

The shorthand is intended for the common case of flexible input specialization with no required relationship between parameter types or between parameters and the return type. Any contract stronger than that requires explicit syntax.

### The Abstract Annotation

The `@abstract` annotation on a parameter is a compiler hint that the function is designed around dynamic dispatch and the abstract form of the parameter. Without the annotation the compiler silently accepts any conforming specialization — concrete or abstract — through the implicit generic expansion. With the annotation the compiler emits a warning when the function is called with a concrete specialization that could have been statically dispatched, nudging callers toward the abstract form.

```
// No annotation — compiler accepts any conforming specialization silently
Animal first(List<Animal> list)

// With annotation — compiler warns when called with a concrete specialization
Animal first(@abstract List<Animal> list)
```

The annotation does not change what types are valid at the call site. It is a communication of intent — the function author is declaring that the abstract form is the expected usage, and the compiler enforces that expectation through warnings rather than errors. It also serves as documentation that the function is designed around heterogeneous dynamic dispatch rather than per-call-site monomorphization.

### Covariance at the Specialization Boundary

The shorthand form naturally provides covariance over generic type arguments at the specialization boundary. A function written with `List<Animal>` in shorthand accepts any `L<T>` where `L` implements `List` and `T` implements `Animal` — not because `List<Dog>` is a subtype of `List<Animal>`, but because the function is implicitly generic over both the list type and the element type and monomorphizes for each concrete combination at the call site.

This is not type-level covariance. The type system remains invariant — `List<Dog>` and `List<Animal>` are unrelated types with no implicit conversion between them. The flexibility exists at the specialization boundary: the function accepts multiple distinct specializations across multiple levels of nesting by virtue of being generic over all abstract type positions recursively. The programmer writes what appears to be a function over an abstract list of abstract animals and gets one that works correctly for any concrete combination satisfying those interfaces.

This covariance extends to any depth of nesting in the input parameter types and applies uniformly across all interfaces. It is a consequence of the shorthand's recursive implicit generic parameter introduction rather than a separately designed feature.

### Monomorphization

When a generic function is called with concrete type arguments, the compiler generates a specialized version of the function body for those specific types. This specialization is performed at compile time and produces code with no generic overhead — the resulting function is equivalent to one written directly for those types.

Monomorphization may produce multiple copies of a function body when called with different concrete argument types. This is the standard tradeoff of static dispatch — code size increases in exchange for zero dispatch overhead and full inlining opportunities.

### Dynamic Specialization

When a generic function is called with abstract type arguments, no monomorphization occurs. The function operates through dynamic dispatch for the abstract parameter. The same function body serves all abstract callers without duplication. This is the appropriate choice for large functions or library functions intended to work with any conforming type, where the cost of dispatch is acceptable and code duplication is undesirable.

---

## Generic Methods

A generic method is a method on a type or interface that introduces its own type parameters independent of the type's parameters. The method's type parameters are resolved at the call site.

```
class Buffer {
    ...
    void write<Serializable T>(T value) { ... }
}
```

Generic methods on concrete types follow the same rules as generic functions — dispatch over the method's own parameters is determined by the argument types at the call site.

### Generic Methods on Interfaces

Generic methods may be declared on interfaces. The vtable always provides a maximally abstract entry point for every method, including generic ones. This ensures that a generic method on an interface can always be called through an abstract receiver — the language never blocks a call, though the cost varies significantly depending on how the call is made.

**Dispatch axes are independent.** The receiver and each generic method parameter are independent dispatch axes. The vtable handles receiver dispatch only. The method's own generic parameters are always resolved at the call site. This is the guiding principle for generic method dispatch in Mjolnir — each axis operates independently and the programmer is responsible for understanding the cost at each axis.

```
interface Sink {
    void write<Serializable T>(T value)
}
```

There are three dispatch paths for a generic method called through an abstract receiver, in order of cost:

**Call-site static dispatch.** The receiver's concrete type is known at the call site. The compiler monomorphizes the full method including its own generic parameters. No vtable involvement. This is the ideal case and the most common one — the receiver happens to be concrete and everything proceeds as a normal generic function call.

**Maximally abstract vtable dispatch.** The receiver is abstract and the method's generic arguments are also abstract at the call site. The vtable entry for the method uses the maximally abstract signature — all generic parameter positions are represented in their most abstract form. The compiler generates argument transformations at the call site to convert concrete values to their abstract representations before the call, and converts the return value back afterward. The cost is proportional to the complexity of the generic signature and compounds for nested abstract types. This path is always available and always correct.

**Auto-generated adapter dispatch.** An optimization over the maximally abstract path, available when the read-only constraint is satisfied for all abstract argument positions. Rather than transforming values, the compiler generates a lightweight adapter type that holds a reference to the concrete value and presents the maximally abstract interface over it through its own generated vtable. No heap allocation — the adapter is stack allocated and its lifetime is bounded to the call. The cost is a double vtable dispatch: one into the adapter, one from the adapter to the concrete implementation. Argument transformations within the adapter are still required but operate through references rather than value copies.

The adapter optimization is not applicable when mutable reference positions are present in the generic method signature. A mutable reference in the maximally abstract form would permit the callee to write back a value of any conforming concrete type, but the adapter is backed by a specific concrete type and cannot satisfy that contract. Mutable reference positions in generic method signatures require the maximally abstract vtable path with full value transformation, or explicit programmer-provided adapter logic that acknowledges the limitation.

**The read-only principle at the dispatch boundary.** The restriction on mutable references in adapter generation is the same principle that governs abstract specialization compatibility and layout stable coercion — abstraction is a one-way narrowing of the concrete contract. Immutable references and owned values flow safely from concrete to abstract because information only moves outward. Mutable references break this because they allow information to flow back inward, which the concrete layout cannot safely accommodate for an arbitrary abstract type. This principle is consistent across the entire language wherever abstraction boundaries are crossed.

This is a meaningful distinction from languages where generic methods make an interface non-object-safe and cannot be called through an abstract receiver at all. In Mjolnir the language always provides a path. The programmer chooses the cost they are willing to pay.

---

## Generic Interfaces

An interface may be parameterized over type parameters, making it a generic interface. A generic interface defines a contract that is itself parameterized — implementing types must provide conforming implementations for each specialization of the interface they declare.

```
interface Collection<type T> {
    T& get(Int index)
    Int len()
}
```

A concrete type may implement a generic interface for specific type arguments, for all type arguments, or for type arguments satisfying certain constraints.

```
class ArrayList<type T> { ... }

impl<Collection<Int>> ArrayList<Int> {
    Int& get(Int index) { ... }
    Int len() { ... }
}
```

Abstract specialization compatibility may apply to a generic interface parameter just as it does to a generic type parameter, following the same constraints.

---

## Generic Arguments

A generic argument is the value supplied to a generic parameter at the point of specialization. Generic arguments fully determine the specialization — the resulting type, function, or method is distinct for each unique set of arguments.

### Generic Type Arguments

A generic type argument is a concrete or abstract type supplied to a generic type parameter. Type arguments may be:

- **Concrete types** — produce static dispatch, inline storage, and monomorphized specializations
- **Abstract types** — produce dynamic dispatch, heap allocated owned values, and a single non-duplicated specialization
- **Other generic type parameters** — a generic type may forward its own parameters as arguments to nested generic types, producing a fully parameterized nested specialization

### Generic Value Arguments

A generic value argument is a compile-time value supplied to a generic value parameter. Valid generic value arguments are values whose type is convertible to a primitive — integers, booleans, and enum variants. The compiler uses value arguments as specialization keys to produce distinct specializations for each distinct value.

### Argument Inference

Generic arguments may be inferred from context when the compiler can determine them unambiguously. For generic functions, type arguments are typically inferred from the types of the value arguments provided at the call site. Explicit annotation is required when inference is ambiguous or when the programmer wishes to force a specific specialization.

---

## Constraints

A constraint on a type parameter restricts the set of valid type arguments to those implementing a given interface. Constraints make the interface's methods available on values of the parameter type within the generic definition.

```
void sort<Ordered T>(T[] list) { ... }
```

Multiple constraints may be applied to a single parameter using the `+` operator. A type argument must satisfy all declared constraints to be valid for that parameter.

```
void store<Ordered + Serializable T>(T value) { ... }
```

An unconstrained parameter declared with `type` accepts any type. Within the definition, no methods may be called on values of an unconstrained parameter — the only valid operations are those defined for all types, such as ownership transfer and destruction.

### The Where Clause

More expressive prototype constraints may be declared using the `@where` annotation, which prefixes the function prototype. `@where` is a compile-time declaration — all expressions inside it must be resolvable at compile time. Type property checks use the `is` keyword and resolve to Boolean at compile time. Value expressions must be statically known. Boolean operators are spelled `and`, `or`, and `not`.

```
// Type constraint at prototype
@where(T is Ordered and U is Ordered)
Int compare<type T, type U>(T a, U b) { ... }

// Relationship between type parameters
@where(T is U)
U transfer<type T, type U>(T source) { ... }

// Type constraint at prototype — value validation handled in body
@where(T is Serializable)
void serialize<type T>(T value, Int maxSize) { ... }

// No prototype constraint needed — value validation handled in body
Buffer create_buffer(Int capacity) { ... }
```

The `@where` annotation can express relationships between parameters that the type signature alone cannot — relationships between generic parameters, value preconditions, and any other compile-time Boolean condition that must hold at the call site. Type constraints in `@where` and inline constraints on generic parameters are equivalent and may be used interchangeably or combined.

The `@` prefix is the general annotation syntax in Mjolnir. `@where` is one specific annotation. Others such as dispatch assertions and live update stability declarations follow the same `@annotation(...)` pattern.

---

## Specialization and Distinctness

Every unique combination of generic arguments produces a distinct specialization. Specializations of the same generic definition over different arguments are unrelated types — there is no implicit conversion, subtype relationship, or shared identity between them.

Relationships between specializations must be established explicitly through abstract specialization compatibility, which permits zero-cost reference coercion between a concrete and abstract specialization when the layout conditions are satisfied, or through constructor-based casting, which produces a new owned value in the target specialization form.

Neither mechanism introduces a subtype relationship. They are narrow, verified operations justified by specific layout or contract properties, not general statements about the relationship between specializations.
