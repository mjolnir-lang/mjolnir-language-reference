# Slices

Slices are dynamically sized references to arrays.

They do not own the data they provide access to.

They are reassignable.

## Slice Type Declaration

The slice type is specified by an empty pair of square brackets after a type name.

```mj
u32[] slice_of_u32
u32*[] slice_of_ptr_to_u32
```

This is similar to the array type specifier, but the absence of the array size
argument (which must be determined at compile time) indicates that the size is
dynamic and stored along with the reference to the array data.

## Memory Layout

Slices are wide pointers. They store a pointer to the first element in the
references data, and a size.

The canonical form of this datatype is

```mj
@valuetype
class Slice<type T> {
    T *data = null
    u32 size = 0

    /// Default Constructor (implicit)
    Slice() {
        data = null
        size = 0
    }

    /// Copy Constructor (implicit)
    /// This is not a move because the `@valuetype` annotation is applied
    Slice(T[] other) {
        this = other
    }

    /// Constructor from parts
    Slice(T *data, u32 size) {
        .data = data
        .size = size
    }

    /// Constructor from array
    Slice<u32 SIZE>(T[SIZE] &other) {
        data = other
        size = SIZE
    }

    /// Data Property
    safe T *data(safe) => data

    /// Size Property
    u32 size(safe) => size

    /// Assignment Operator (implicit)
    /// This is not a move because the `@valuetype` annotation is applied
    void {=}(T[] other) {
        this = other
    }

    /// Assignment Operator (implicit)
    void {=}<u32 SIZE>(T[SIZE] &other) {
        data = other
        size = SIZE
    }

    /// Type Cast
    safe T *{(:)}(safe) => data

    /// Dereference
    safe T &{*}(safe) => *data

    /// Index
    safe T &{[]}(safe; u32 index) => data[index]

    /// Slice
    /// This operator allows one or both arguments to be empty.
    safe T[] {[:]}(safe; u32 start = 0, u32 stop = size) => data[start:stop]
}
```

Slices only support the fol,lowing operations:

- initialization
- assignment
- indexing by `u32`

## Creation

Just are pointers are created by dereferencing, slices are crated by slicing.

```mj
u32[16] array
u32[] slice = array[2:8]
slice.size() // `6` which is `(8 - 2)`. Index 8 is not included in the slice
slice.data() // Same as `&array[2]`.
```
