# CV Type Qualifiers

CV qualifiers are storage class qualifiers used to augment the access to types.
There are two cv qualifiers: `const` and `volatile`. These work together to
provide complete control over type access and mutability.

There is another qualifier which has a limited application. `mutable` may be
used only with member variables to preserve interior mutability when the
containing type is marked `const`.

## Behavior

The `const` qualifier, when applied to a type expression, restricts mutability through that type.

It does not provide guarantees that that type will not change though other means, but accesses
through the type will be unchanged.

The `volatile` qualifier, when applied to a type expression, requires that all
accesses through that type are preserved and in order. The compiler must
assume that the memory through that type is constantly changing.

When combined, `const` and `volatile` combine their meanings literally. A
`const volatile` type may  not be modifierd by the compiler and must be
accessed literally.

## C++

Appear in any type specifier, including decl-specifier-seq of declaration grammar, to specify constness or volatility of the object being declared or of the type being named.

`const` - defines that the type is constant.
`volatile` - defines that the type is volatile.

Explanation

For any type T (including incomplete types), other than function type or reference type, there are three more distinct types in the C++ type system: const-qualified T, volatile-qualified T, and const-volatile-qualified T.

Note: array types are considered to have the same cv-qualification as their element types.

When an object is first created, the cv-qualifiers used (which could be part of decl-specifier-seq or part of a declarator in a declaration, or part of type-id in a new-expression) determine the constness or volatility of the object, as follows:

- `const` - an object whose type is const-qualified, or a non-mutable subobject of a const object. Such object cannot be modified: attempt to do so directly is a compile-time error, and attempt to do so indirectly (e.g., by modifying the const object through a reference or pointer to non-const type) results in undefined behavior.
- `volatile` - an object whose type is volatile-qualified, or a subobject of a volatile object, or a mutable subobject of a const-volatile object. Every access (read or write operation, member function call, etc.) made through a glvalue expression of volatile-qualified type is treated as a visible side-effect for the purposes of optimization (that is, within a single thread of execution, volatile accesses cannot be optimized out or reordered with another visible side effect that is sequenced-before or sequenced-after the volatile access. This makes volatile objects suitable for communication with a signal handler, but not with another thread of execution, see std::memory_order). Any attempt to access a volatile object through a glvalue of non-volatile type (e.g. through a reference or pointer to non-volatile type) results in undefined behavior.
- `const volatile` - an object whose type is const-volatile-qualified, a non-mutable subobject of a const volatile object, a const subobject of a volatile object, or a non-mutable volatile subobject of a const object. Behaves as both a const object and as a volatile object.
- `mutable` - permits modification of the class member declared mutable even if the containing object is declared const.
Mutable is used to specify that the member does not affect the externally visible state of the class (as often used for mutexes, memo caches, lazy evaluation, and access instrumentation).
- `mutable volatile` - an object whose type is mutable-volatile-qualified behaves as both a mutable object and as a volatile object.

Each cv-qualifier (`const` and `volatile`) can appear at most once in any cv-qualifier sequence. For example, `const const` and `volatile const volatile` are not valid cv-qualifier sequences.
mutable specifier

## Conversions

There is partial ordering of cv-qualifiers by the order of increasing restrictions.
The type can be said more or less cv-qualified than:

References and pointers to cv-qualified types may be implicitly converted to references and
pointers to more cv-qualified types. In particular, the following conversions are allowed:

- reference/pointer to unqualified type can be converted to reference/pointer to const
- reference/pointer to unqualified type can be converted to reference/pointer to volatile
- reference/pointer to unqualified type can be converted to reference/pointer to const volatile
- reference/pointer to const type can be converted to reference/pointer to const volatile
- reference/pointer to volatile type can be converted to reference/pointer to const volatile

**Note:** additional restrictions are imposed on multi-level pointers.

To convert a reference or a pointer to a cv-qualified type to a reference or pointer to a less cv-qualified type.

## Code Style

The use of cv-qualifiers also improve the ability for programmers to reason about code.

## Optimization

There are several compile-time optimizations which may be performed when cv-qualifiers are used.

## Inheritance (`const` Promotion)

When a user defined type is qualified, its members inherit the qualifiers as well.
This inheritance continues until everything accessed through the type is qualified.

The exception is the `mutable` specifier, which retains interior mutability.

Methods, member functions, are promoted by promoting their return values.
If a method requires the mutation of its object, then it is dropped from the type.
Only if the return path is a reference to object owned memory.
So if the return value is instantiated or is derived from passed parameters, then it will not be promoted.

- `T &` becomes `const T &`
- `T *` becomes `const T *`
  - `T **` becomes `T *const *` (Note that pointers are value type and only the first dereference is const)
  - `T ***` becomes `T **const *`

Funtion pointer return types are not promoted, because they do not provide a reference to memory.

## Safe

The safe qualifier is used to allow for method reuse for both regular and const-
qualifier types.

This also allows the compiler to assume immutability on the object for safe methods.

### Example

```mj
class List<T> {
    T data[32];
    u32 size = 0;

    u32 size(safe) {
        return size;
    }

    void append(T value) {
        data[size] = value;
        size += 1;
    }

    safe T &{[]}(safe; u32 index) {
        return data[index];
    }
}
```

becomes

```mj
class List<T> {
    const T data[32];
    const u32 size = 0;

    u32 size(const) {
        return size;
    }

    const T &{[]}(const; u32 index) {
        return data[index];
    }
}
```

when made `const`.

## Constructors and Initialization

Inside of constructors and initialization contexts, `const` member variables are considered mutable.

Parameters of const constructors may become const if they directly preserve the state of their values while assigned to the
member variables of the object being initialized.

When a const object is being initialized, it is mutable until the constructor returns.

`volatile` maintains its meaning in all contexts.

## Interfaces

Interfaces require a means of communicating the const-volatile promotion of virtual methods, since there is no definition
from which to infer behavior.

The for this reason, the `@const(const T &)` attibute should be used to enforce the promotion in all implementations.

The `@virtual` attribute should be used as well for default methods.

## Initialization

- `const` variables must be initialized at declaration or in the constructor
- `volatile` variables have no special initialization rules.
