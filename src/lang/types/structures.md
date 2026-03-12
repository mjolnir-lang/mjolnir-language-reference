# Structures

Structures are user defined compound data types used to define a structured layout of members.
Specifically they are POD (Plain Old Data) types.

Structures are groups of related data. They maintain order and alignment requirements

There is no padding before the first element. There is padding between elements
only when required to preserve the alignment of the following member.
There is padding after the last member only when required to preserve the
alignment of the first member as in an array.

Structure do not have methods or implementations. They do not have constructors
or destructors. They may have members. All of their members must be
primitives or structures.

## Structure Definitions

Structures are defined with the `struct` keyword.

```mj
struct Packet {
    u32 size
    u16 tx_id
    u16 rx_id
    u8[32] data
}
```

Untyped structures are not given a type name, so they cannot be referenced.

```mj
struct Packet packet {
    u32 size
    u16 tx_id
    u16 rx_id
    u8[32] data
}
```

```mj
struct packet {
    u32 size
    u16 tx_id
    u16 rx_id
    u8[32] data
}
```

An anonymous, untyped structure definition is possible, but its members are accessible within the containing scope and
it cannot be referenced in any way. This feature is only useful for annotating multiple variables as the same time.

For example it is possible to make a group of members or local variables shared, or to provide different class member
layouts for different API versions.

```mj
class Protocol {

    @api(1.0)
    struct {
        u32 version
        u32 *data
        u32 size
    }

    @api(2.0)
    struct {
        u32 version
        u32[] data
    }

    @shared
    struct {
        const u32 MAX_SIZE = 64
        const u32 MIN_VERSION = 0x010200
    }
}
```

## Anonymous Structures

Anonymous structures, along with anonymous unions, serve to define overlapping
regions of memory within a type and do not name a new type. Anonymous
structure and union members are accessed through the containing type directly
if the anonymous structure or union is unnamed.

```mj
struct {
    u32 size
    u16 tx_id
    u16 rx_id
    u8[32] data
}
```

## Memory Layout

Unlike local variables in functions or global variables, structure members are stored in the order
in which they are declared. The compiler will not perform reordering to minimize padding. This
means that relative memory access may be performed safely using pointer arithmetic and offsets.

This is not recommended in most situations, but it is well defined for the purposes of byte level
comparison, hashing, or copying of structures.

Structures constitute a contiguous region of memory that is not guaranteed with sequential
variable declarations.

This feature is also used by the compiler to detect bad memory accesses and aliasing of types,
so that strict aliasing is not enforced.

## Structure Padding

Every member in a structure is stored at some offset in bytes withing the record.
Because most computer architectures require aligned memory access or incur performance penalties for unaligned memory accesses, objects must be aligned according to their composition of fundamental types.

When members are stored contiguously, the compiler may have to insert space between
them to satisfy their alignment requirement. This space is called padding and is
cannot be used for any purpose. In fact, padding may cause raw memory access to
be undefined since its contents are not set by any normal access pattern after
structure initialization. Structures are required to set the padding to zero
for binary compatibility at initialization only. This one time assignment
is not guaranteed to be present when the type system is circumvented.

## Structure Packing

Structure packing is the process of locating members immediately after one another and ignoring their
specific alignment requirements. This has the benefit of correctly representing comparative memory layouts for
packet structures or binary data, but at the cost of increased overhead for member access in every case.

Taking the address of unaligned members is illegal, since it may result in illegal operation

```mj
/// This structure is only 8 bytes in size because no padding is inserted between members.
/// The `@packed` attribute can only be applied to types and not variables themselves.
/// Normally this struct would be 12 bytes (3 bytes at the end to facilitate sequential
/// alignment within arrays and 1 byte after the `id` member)
@packed
struct Packet {
    u8 id
    u16 size
    u32 magic
    u8 version
}
```

## Member Access

Structure members are accessed by name using the `.` operator. Aside from strong memory guarantees,
structures are effectively variable namespaces.

```mj
Point<u32> point = {0, 0}
point.x = 7
u32 y = point.y
```

## Structure Type Aliasing

Because type aliasing inherits the constraints and capabilities of the base
type, structure aliases cannot define any methods, constructors, destructors, operators, or members.
The alias is always pure.

```mj
type<Point<u32>> Coord
Coord c = {0, 3}
c.x += c.y
c = Point<u32> {4, 33}
```

### Structure Initialization

Bitfields, structures, unions, and variants do not have constructors, but, with
the exception of bitfields, they do have destructors.

Structure initialization has two forms: structural and inlined.

When a structure is initialized, all of its members are initialized at the same time.

```mj
Point<u32> point = {0, 7}

void Bitmap::set_position(Point<u32> position)

bitmap.set_position({0, 3}) // Initialization and assignment allow the type of structure to be inferred.
bitmap.set_position(Point<u32> {0, 3}) // Also valid, but unnecessary

// However a type cast is not sufficient to infer the structure type, because casting is
// an operator that belongs to the type, and `{2, 4}` does not have a type by itself.
// Point is not able to define a constructor or assignment operator overload that can accept
// the untyped brace initializer.
u32 x = (Point<u32>: {2, 4}).x // invalid
```

```mj
Point<u32> point = {0, 7}
u32 x = Point<u32> {0, 7}.x
```

### Inline Initialization

Inline initialization can be considered a constructor call. This means that constant structure initialization
can be performed as with class constructors.

```mj
Point<u32> point = {
    .x = 0
    .y = 7
}
```

```mj
Point<u32> point = {
    .x = 0
    .y = 3 * .x + 7
}
```

## Structure Assignment

When structures and other POD types are assigned after being initialized, their destructor must be called.

Structures do not have assignment operator overloading, so the assignment operators for each member are called.

Using structural assignment allows only specified members to be assigned while preserving the values of
other members. Note that this is different from initialization in that unspecified members are default initialized when the
structure if being assigned.

```mj
Point<u32> p1 = {3, 4}
Point<u32> p2
p2 = p1
```

## Generic Structures

Structures may be generic.

```mj
struct Point<type T> {
    T x
    T y
}
```

> **Note:** There is no way to define or reference a generic anonymous type.
