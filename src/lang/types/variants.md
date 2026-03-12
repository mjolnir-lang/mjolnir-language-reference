# Variants

A variant is a combination of a union and an enum of the union member IDs.

The ID values are meaningful only in the context of the variant and not usable with variants
containing the same type.

The ID type can be explicitly specified and specific values can be assigned.

A variant is a complete type and has a destructor, unlike a union.

```mj
union<n8> Shape {
    Circle circle
    class Ngon {
        n32 sides
    }
}
```

```mj

// Variant

class Event<type T> {
    union data {
        f64 time
        struct {
            n32 x
            n32 y
        } actor
        n32 resume_choice
        n8 exit_code
    }
    T type


    @shared
    const T START = 0

    @shared
    const T PAUSE  = 1

    @shared
    const T RESUME = 2

    @shared
    const T STOP = 3


    Self(uninitialized) {
        match (type) {
            START => self = uninitialized
            PAUSE => self = uninitialized
            RESUME => self = uninitialized
            STOP => self = uninitialized
        }
    }
}
```
