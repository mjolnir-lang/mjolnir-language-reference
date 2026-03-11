# Generic Parameters

A generic parameter is a placeholder in a generic definition resolved to an argument at the point of specialization. Generic parameters are ordinary parameters — they are not a distinct category of language entity but simply parameters whose arguments are supplied at compile time rather than at runtime.

Mjolnir supports two kinds of generic parameters.

## Generic Type Parameters

A generic type parameter stands in for a type argument. Type parameters may be constrained by interfaces. A constraint declares that the type argument must implement a given interface, making the interface's methods available on values of the parameter type within the definition. An unconstrained type parameter accepts any type.

## Generic Value Parameters

A generic value parameter stands in for a value argument. Valid generic value arguments are values whose type is convertible to a primitive — integers, booleans, and enum variants. This boundary ensures that the compiler can use value arguments as specialization keys: they are comparable and have no runtime identity beyond their value.
Enum variants are a natural fit for generic value arguments. They are named compile-time constants that reduce to integer values, and using them as generic arguments produces distinct specializations with readable names rather than opaque integer literals.

```mj
class Buffer<EncodingKind ENCODING>

Buffer<UTF8> utf8_buf
Buffer<ASCII> ascii_buf
```

`Buffer<UTF8>` and `Buffer<ASCII>` are distinct types. The encoding is selected entirely at compile time with no runtime tag and no branch.

Generic type parameters and generic value parameters may appear together in the same definition in any combination.

### Specialization Distinctness

Generic parameters are resolved at specialization time and the resulting specialization is a distinct type.     `Container<PoolAllocator>` and `Container<Allocator>` are different types, as are `Buffer<UTF8>` and `Buffer<ASCII>`. There is no implicit relationship between specializations of the same generic definition over different arguments.
