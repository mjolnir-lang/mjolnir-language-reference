# Interface Methods

## Methods

Interface methods may have default implementations.



### Method Annotations

- `@pure` This requires the implementation of the method to have no side effects, such that
the method will return the same value for the same set of arguments and will not affect object or
global program state. This enables the compiler to optimize repeated, identical calls to this method
into a single call whose value is stored for re-use by the calling code.

Pure methods and functions are generally inferred by their code, but interfaces must be explicit.

- `@shared` This binds the method to the interface type itself and not to each implementation.

Shared interfaces methods are not included in the implementation for that interface and they must be defined in the interface
declaration. Shared interface methods are also final

- `@final` This prevents the value from being overridden in an implementing interface or class

Final interface methods are not included in the implementation for that interface
and have the benefit of being able to be inlined.

### Method Implementation

Interfaces do not have any binary record structure.

Instead, every implementation of an interface emits an immutable record structure containing method and function pointers, and even pointers of other implementation records or offsets of member variables

### Interface Method Specialization

Because interface methods are implemented by the implementing class or interface or by a default implementation,
The calling convention is changed in each case.

Whe called through an interface reference, the function call is transformed into a vtable lookup and the
implementation reference is passed to that method.

When a class calls an interface method that has a default implementation which has bnot been overridden,
the compiler may choose to generate a specialized version of that default implementation which may
allow multiple virtual method calls to be inlined.

When an class calls an interface method whose signature is provided by multiple implementations, the
call is ambiguous and will not compile. Either cast the object to the desired interface or qualify the
the method name with the name of the interface.
