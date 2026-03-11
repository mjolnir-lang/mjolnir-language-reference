# Implementations

An implementation is an item that associates a type with an interface.

There are two types of implementations:

- Direct
- Indirect

Implementations provide definitions for methods that satisfy the declarations in an interface.

```mj
interface Serializable {


    bool serialized(safe)


    /// Default implementation
    Vector<u8> serial_data serialize(safe) {
        serial_data.append(sizeof(This))
        serial_data.append((const u8 *: this), sizeof(This))
    }
}

impl<Serializable> StringView {

    /// Required Implementation
    bool serialized(safe) => sizeof(this)

    /// Overridden implementation (optional)
    Vector<u8> serial_data serialize(safe) {
        serial_data.append(size)
        serial_data.append(data)
    }
}
```

## Implicit Implementation

An implementation may be implicit if 

```mj
interface Iterable<type T> {
    Iterator<safe T> iterator(safe)
}


interface Collection<type T> {
    u32 size(safe)
}


impl<Iterable<T>> Collection<type T> {
    Iterator<safe T> iterator(safe)
}


class Vector<type T> {
    Box<T> data
    u32 capacity
    u32 size


    u32 capacity(safe) => capacity

    u32 size(safe) => size
}


impl<Collection<T>> Vector<type T> {
    u32 size(safe) => size
    Iterator<safe T> iterator(safe) => data
}
```

## Implementation Template

An implementation template is defined with a [template parameter list](../template-parameter-list.md) after the implementing type name

```mj
impl<Iterable<T>> List<type T> {
    ...
}
```
