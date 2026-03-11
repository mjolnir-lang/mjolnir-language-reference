# Type

Every variable, item, and value in a Rust program has a type.

A type

The type of a value defines the interpretation of the memory holding it and the operations that may be performed on the value.

Built-in types are tightly integrated into the language, in nontrivial ways that are not possible to emulate in user-defined types. User-defined types have limited capabilities.

The list of types is:

    Primitive types:
        Boolean — bool
        Numeric — integer and float
        Textual — char and str
        Never — ! — a type with no values
    Sequence types:
        Tuple
        Array
        Slice
    User-defined types:
        Struct
        Enum
        Union
    Function types:
        Functions
        Closures
    Pointer types:
        References
        Raw pointers
        Function pointers
    Trait types:
        Trait objects
        Impl trait
