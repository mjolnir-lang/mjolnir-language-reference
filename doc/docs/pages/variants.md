# Variants

A variant is a combination of a union and an enum.

```mj

// Variant

class Event<T> {
    Data data
    T type

    union Data {
        f64 time
        struct {
            u32 x
            u32 y
        } actor
        u32 resume_choice
        u8 exit_code
    }


    shared<T> {
        const T Start  = 0
        const T Pause  = 1
        const T Resume = 2
        const T Stop   = 3
    }
}
```
