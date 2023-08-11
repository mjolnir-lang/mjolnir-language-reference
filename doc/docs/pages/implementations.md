# Implementations

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
