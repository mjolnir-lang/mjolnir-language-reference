# Annotations

## Global

### `@target(String name)`

Used to include features for the target platform.

### `@address(n64#bytes address)`

Used to set the address of an object or method.

```mj
@address(0x00A30080)
n8[64] buffer
```

### `@pure`

Used to identify methods in an interface which must be pure functions

No side effects and same return value for same arguments

```mj
interface Sized {

    @pure
    n32 size(safe)
}
```

### `@shared`

Used to make members or methods bound to the type itself so they will be shared by each instance and
not unique to each one. Usually this is done so that the member or method is explicitly distinct,
but the methods and members could be defined for use on the instances under the hood.

```mj
class ShapeFactory {

    @shared
    n32 MAX_SHAPES = 32

    @shared
    Shape make(n32 sides) => ...
}

n32 max = ShapeFactory::MAX_SHAPES
Shape septagon = ShapeFactory::make(7)
```

### `@api(n32 major, n32 minor)`

Used to associate a declaration with a version.

```mj
@api(3, 5)
void run()
```

### `@deprecated(n32 major)`

Used to remove a name from a version.

### `@impl(interface I)`

Used to implicitly implement an interface. May be bound to the implementer itself or a primary
method which belongs to the interface.

The standard pattern for implementing an interface is to explicitly declare an implementation of
that interface for the implementer.

```mj
class Ipv4Address {
    n8[4] octets
}

impl<Writeable> Ipv4Address {

    void write_to(Writer& writer) {
        writer.write("\(octets[0]).\(octets[1]).\(octets[2]).\(octets[3])")
    }
}
```

If there's only one method to implement, we can just annotate the method directly within the
implementer.

```mj
class Ipv4Address {
    n8[4] octets

    @impl(Writeable)
    void write_to(Writer& writer) {
        writer.write("\(octets[0]).\(octets[1]).\(octets[2]).\(octets[3])")
    }
}
```

Better yet, if the interface doesn't require any methods to be implemented, we can just annotate the
implementer directly.

```mj
// Will fallback to printing its members in order, which will be `"[0, 0, 0, 0]"` for the member
// `octets`, which is close enough.
@impl(Writeable)
class Ipv4Address {
    n8[4] octets
}
```

### `@internal`

Used to hide methods from an API.

### `@final`

Prevent overloading of the method.

### `@size(n32#bytes size)`

Force an object size

### `@debug`

Used to exclude debug features from a release build

### `@ignore`

Used to exclude feature from any build

### `@where(bool constraint)`

## Type

Manipulate the type.

### `@value-type`

Used to mark a type as pass by value instead of pass by reference.

## Code

## Data

Directly annotate the date, not just the variable.

## Variable

## Member

### `@offset(n32#bytes offset)`

Force a member variable offset or a virtual method index.

## Memory Fragmentation
