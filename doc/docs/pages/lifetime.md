# Lifetime

All objects have a lifetime.

## Copy and Move

Some objects are movable and others immovable, similarly note evry object may be copied.

C++ has both move assignment and copy assingment as well as copy and move constructors.

To improve the ability to reason about code, there should only be move assignment
and copy constuctors. Copy assignment for primitive value types should be explicitly
declared by a combination of copy constructor and move assignemnt.

Since we do not assign, but initialize.

Objects may be copyable, movable, neither, or both.

- `moveable` - The object does not depende on references to its location. (no mutexes, no cyclic pointers, no non-movable members, etc.)
- `copyable` - The object is immovable, but may be copied. (No unique managed resources, no non-copyable members)

A move will destroy the original object and is generally more performant.
A copy will preserve the original object and is generally more expensive.

## Reference lifetimes

When objects are passed by reference, we need a way to determine if that
reference is persisted beyond the function call, otherwise we may drop
references.

Declare lifetime to be that of the object.

Declare lifetime to be between the call and the destruction of the object.

The problem is that when you pass arguments by reference you do not know from
the function call signature if the reference will be held longer than the call
itself. Rust introduces a borrow checker with explicit lifetime tracking but
that is too much in this instance. We simply want to know if the reference will
be held and for how long.

## Managed lifetimes

When objects are created within a data structure or on the heap in such a way
that they are independent of scope, then they are managed.

Managed objects must be manually destroyed either by container destructors or
by manual destructors.

## Scope

Objects declared within a scope inherit the lifetime of that scope.

### Explicit lifetime type notation

Type expressions containing references or pointers may indicate liftime contraints for objects passed as arguments to methods, functions, or constructors.

- `&` or `*` The reference will not be stored and the referenced object need not exist beyond the call.
- `&'` or `*'` The reference will be stored and the referenced object must exist for the lifetime of the object whose method was called.
- `&"` or `*"` The reference will be stored and the referenced object must exist beyond the lifetime of the object whose method was called (forever).

Example:

```mj
class Box<T> {
    T &data;


    Box(T &'data) {
        this.data = data;
    }
}
```

Objects may

```mj
class Box<T> {
    T &data;


    Box(T &'data) {
        this.data = data;
    }
}
```
