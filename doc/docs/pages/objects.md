# Objects

An object is a unit of typed storage. This is distinct from a variable in that a variable is a named
accessor of an object. A means of accessing it with limitations on ownership, and cv-qualifiers.

Objects may be accessed through multiple variables.

It is necessary that every object has one owner. A non-reference variable such that the object's lifetime
is bound to that variable and it will be destroyed when the variable goes out of scope or if the
variable is re-initialized.

Generally the term object is used to refer to an instance of a type independently of its type.
This is meaningful for simplifying discussions.

All objects have a size, minimum alignment, cv qualifiers, and an address.
These are the fundamental attributes of all types.

## Object Interface

There is a common interface shared by all objects, `Object`

```mj
interface Object {
    u32 type_size // The implementation type size (may be different than the object size, if the object has an explicit `@size()` annotation)
    u8 type_alignment // The implementation type alignment (may be different than the object alignment, if the object has an explicit `@align()` annotation)

    ~Object()

    /// The runtime type ID (only unique per compilation)
    @final
    u64 type_id() {
        return (u64: &this)
    }
}
```
