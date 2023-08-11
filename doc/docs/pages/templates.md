# Templates (Generic Types)

Templates, or Generic Types, are 

## Type Parameters

`<...>`

## Restrictions

While interfaces themselves may be generic, they cannot contain generic methods that are not are final or shared.
This is because it is impossible to implement vtable records for each instantiation of the template method
in each implementation. It cannot be done dynamically either.

One exception is to use type erasure to implement a common base version of the method and use a generic implementation
to call that function. This is what `@final` does.

```mj
interface MyInterface<type T> {


    void append(const u8[] data)


    /// This is not allowed because it requires generic vtable records for each implementing type.
    void append<type U>(const U &data)


    /// This is fine because it can be implemented without requiring a potentially infinite number of vtable records for each implementing type.
    @final
    void append<type U>(const U &data) {
        append((const u8 *: &data)[0:sizeof(U)])
    }


    /// This is fine because each implementation is not responsible for implementing it.
    @shared
    const u8[] convert_data<type U>(const U &data) {
        return (const u8 *: &data)[0:sizeof(U)]
    }
}
```
