# Generic Types

A generic type is a type definition parameterized over one or more type parameters. The memory layout of a specialization is determined entirely by the type arguments. No information about the generic definition itself is present at runtime — only the specialization exists.

```mj
type Stack<type T> {
    T[] data
    int top
}
```

A concrete type argument produces a specialization with inline homogeneous storage, statically known layout, and thin pointer references. An abstract type argument produces a specialization with heap allocated owned values, dynamic dispatch, and fat or thin pointer references depending on the interface's reference representation.

A generic type may declare abstract specialization compatibility over a parameter, enabling zero-cost coercion between its concrete and abstract specializations. See the abstract specialization compatibility document for the conditions and constraints.

## Multiple Parameters

A generic type may have any number of type parameters. Each parameter is resolved independently at specialization time. Parameters are orthogonal by default — the memory model of each parameter position follows from its own argument without reference to the others.

```mj
type Map<type K, type V> {
    K[] keys
    V[] values
}
```












# Generics

Mjolnir supports generics over types, functions, methods, and interfaces. A generic definition is parameterized over one or more type parameters that are resolved to type arguments at the point of use. The behavior and memory model of the resulting specialization follow directly from the argument types provided — no special annotations or modes are required.

---

## Generic Parameters

A generic parameter is a placeholder in a generic definition resolved to an argument at the point of specialization. Generic parameters are ordinary parameters — they are not a distinct category of language entity but simply parameters whose arguments are supplied at compile time rather than at runtime.

Mjolnir supports two kinds of generic parameter.

### Generic Type Parameters

A generic type parameter stands in for a type argument. Type parameters may be constrained by interfaces. A constraint declares that the type argument must implement a given interface, making the interface's methods available on values of the parameter type within the definition. An unconstrained type parameter accepts any type.

### Generic Value Parameters

A generic value parameter stands in for a value argument. Valid generic value arguments are values whose type is convertible to a primitive — integers, booleans, and enum variants. This boundary ensures that the compiler can use value arguments as specialization keys: they are comparable and have no runtime identity beyond their value.

Enum variants are a natural fit for generic value arguments. They are named compile-time constants that reduce to integer values, and using them as generic arguments produces distinct specializations with readable names rather than opaque integer literals.

```mj
type Buffer<Encoding: EncodingKind> {
    ...
}

let utf8_buf = Buffer<Encoding.UTF8> { ... }
let ascii_buf = Buffer<Encoding.ASCII> { ... }
```

`Buffer<Encoding.UTF8>` and `Buffer<Encoding.ASCII>` are distinct types. The encoding is selected entirely at compile time with no runtime tag and no branch.

Generic type parameters and generic value parameters may appear together in the same definition in any combination.

### Specialization Distinctness

Generic parameters are resolved at specialization time and the resulting specialization is a distinct type. `Container<PoolAllocator>` and `Container<Allocator>` are different types, as are `Buffer<Encoding.UTF8>` and `Buffer<Encoding.ASCII>`. There is no implicit relationship between specializations of the same generic definition over different arguments.

---

## Generic Types

A generic type is a type definition parameterized over one or more type parameters. The memory layout of a specialization is determined entirely by the type arguments. No information about the generic definition itself is present at runtime — only the specialization exists.

```mj
type Stack<T> {
    data: [T],
    top: Int,
}
```

A concrete type argument produces a specialization with inline homogeneous storage, statically known layout, and thin pointer references. An abstract type argument produces a specialization with heap allocated owned values, dynamic dispatch, and fat or thin pointer references depending on the interface's reference representation.

A generic type may declare abstract specialization compatibility over a parameter, enabling zero-cost coercion between its concrete and abstract specializations. See the abstract specialization compatibility document for the conditions and constraints.

### Multiple Parameters

A generic type may have any number of type parameters. Each parameter is resolved independently at specialization time. Parameters are orthogonal by default — the memory model of each parameter position follows from its own argument without reference to the others.

```mj
type Map<K, V> {
    keys: [K],
    values: [V],
}
```

---

## Generic Functions

A generic function is parameterized over one or more type parameters. The function body is written against the constraints of the parameters and is valid for any argument types that satisfy those constraints.

```mj
fn max<T: Ordered>(a: T, b: T) -> T {
    if a > b { a } else { b }
}
```

Dispatch for a generic function is determined by the argument types at the call site. Passing concrete types produces a monomorphized specialization of the function with static dispatch throughout. Passing abstract types produces a version operating through dynamic dispatch. The function definition is written once and handles both cases — the caller's argument types determine the dispatch mode, not the function signature.

### Shorthand Generic Functions

Generic functions have a shorthand form where abstract types in input parameter positions implicitly become independent generic type parameters constrained by that interface. This avoids explicit generic parameter declarations for the common case where flexible input specialization is desired without additional constraints between parameters.

```mj
fn process(x: Animal) -> Int
// equivalent to
fn process<T: Animal>(x: T) -> Int
```

Each occurrence of an abstract type in an input parameter position becomes an independent implicit generic type parameter, regardless of repetition. Two parameters typed as the same abstract type produce two independent parameters — no relationship between them is implied.

```mj
fn combine(x: Animal, y: Animal) -> Int
// equivalent to
fn combine<T: Animal, U: Animal>(x: T, y: U) -> Int
```

Abstract types nested within generic type arguments in input parameter positions also become implicit generic type parameters, producing a concrete specialization of the outer type rather than an abstract one.

```mj
fn first(list: List<Animal>) -> Animal
// equivalent to
fn first<T: Animal>(list: List<T>) -> Animal
```

Note that this means a `List<Animal>` value — an abstract specialization with heterogeneous elements — does not satisfy this parameter. The shorthand produces a concrete specialization over the element type, which accepts `List<Dog>` or `List<Cat>` but not `List<Animal>`. A programmer wishing to accept a heterogeneous abstract specialization must use the explicit generic parameter syntax and declare the parameter type as `List<Animal>` directly.

**Return types** always fall back to the abstract form. The function makes no claim about which concrete type it returns — only that it satisfies the interface. The return value carries dynamic dispatch and the abstract memory model per the interface's reference representation.

```mj
fn find(list: List<Animal>, index: Int) -> Animal
// equivalent to
fn find<T: Animal>(list: List<T>, index: Int) -> Animal
// return type is Animal — abstract, not T
```

If the return type must be the same concrete type as an input parameter — a stronger contract — explicit generic parameter syntax is required and the return type must be named explicitly.

```mj
T identity<Animal T>(T x)
// cannot be expressed as shorthand
```

The shorthand is intended for the common case of flexible input specialization with no required relationship between parameter types or between parameters and the return type. Any contract stronger than that requires explicit syntax.

### Covariance at the Specialization Boundary

The shorthand form naturally provides covariance over generic type arguments at the specialization boundary. A function written with `List<Animal>` in shorthand accepts any `List<T>` where `T` implements `Animal` — not because `List<Dog>` is a subtype of `List<Animal>`, but because the function is implicitly generic over the element parameter and monomorphizes for each concrete element type at the call site.

This is not type-level covariance. The type system remains invariant — `List<Dog>` and `List<Animal>` are unrelated types with no implicit conversion between them. The flexibility exists at the specialization boundary: the function accepts multiple distinct specializations of the same generic type by virtue of being generic over the varying parameter. The programmer writes what appears to be a function over an abstract element type and gets one that works correctly for any homogeneous concrete specialization satisfying that interface, as well as for the abstract specialization itself via the return type fallback.

This covariance extends to any depth of nesting in the input parameter types and applies uniformly across all interfaces, not only those with special variance annotations. It is a consequence of the shorthand's implicit generic parameter introduction rather than a separately designed feature.

### Monomorphization

When a generic function is called with concrete type arguments, the compiler generates a specialized version of the function body for those specific types. This specialization is performed at compile time and produces code with no generic overhead — the resulting function is equivalent to one written directly for those types.

Monomorphization may produce multiple copies of a function body when called with different concrete argument types. This is the standard tradeoff of static dispatch — code size increases in exchange for zero dispatch overhead and full inlining opportunities.

### Dynamic Specialization

When a generic function is called with abstract type arguments, no monomorphization occurs. The function operates through dynamic dispatch for the abstract parameter. The same function body serves all abstract callers without duplication. This is the appropriate choice for large functions or library functions intended to work with any conforming type, where the cost of dispatch is acceptable and code duplication is undesirable.

---

## Generic Methods

A generic method is a method on a type or interface that introduces its own type parameters independent of the type's parameters. The method's type parameters are resolved at the call site.

```mj
type Buffer {
    ...
    void write<Serializable T>(T value)
}
```

Generic methods on concrete types follow the same rules as generic functions — dispatch over the method's own parameters is determined by the argument types at the call site.

### Generic Methods on Interfaces

Generic methods may be declared on interfaces. This is possible in Mjolnir because dispatch mode is a call-site property rather than a property of the definition. When a generic method is called on an abstract receiver, the receiver dispatches dynamically through the vtable as normal, and the method's own type parameter is resolved independently at the call site. The two dispatch axes are orthogonal.

```mj
interface Sink {
    void write<Serializable T>(T value)
}
```

A vtable entry for a generic interface method points to an implementation that handles the method's type parameter generically. The type argument travels with the call. The cost is that a call to a generic method through an abstract receiver pays both the dynamic dispatch overhead on the receiver and the call-site dispatch cost on the method's own parameter. This is the correct and expected cost — the programmer retains full control over which parameters are abstract and which are concrete.

This is a meaningful distinction from languages where generic methods make an interface non-object-safe. In Mjolnir, generic methods and dynamic dispatch compose without restriction.

---

## Generic Interfaces

An interface may be parameterized over type parameters, making it a generic interface. A generic interface defines a contract that is itself parameterized — implementing types must provide conforming implementations for each specialization of the interface they declare.

```mj
interface Collection<type T> {
    T& get(nat index)
    nat len()
}
```

A concrete type may implement a generic interface for specific type arguments, for all type arguments, or for type arguments satisfying certain constraints.

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

```mj
void sort<Orderable T>(T[] list)
```

Multiple constraints may be applied to a single parameter. A type argument must satisfy all declared constraints to be valid for that parameter.

An unconstrained parameter accepts any type. Within the definition, no methods may be called on values of an unconstrained parameter — the only valid operations are those defined for all types, such as ownership transfer and destruction.

---

## Specialization and Distinctness

Every unique combination of type arguments produces a distinct specialization. Specializations of the same generic definition over different arguments are unrelated types — there is no implicit conversion, subtype relationship, or shared identity between them.

Relationships between specializations must be established explicitly through abstract specialization compatibility, which permits zero-cost reference coercion between a concrete and abstract specialization when the layout conditions are satisfied, or through constructor-based casting, which produces a new owned value in the target specialization form.

Neither mechanism introduces a subtype relationship. They are narrow, verified operations justified by specific layout or contract properties, not general statements about the relationship between specializations.
