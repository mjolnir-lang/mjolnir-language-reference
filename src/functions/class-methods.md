# Class Methods, Constructors, and Operators

Classes are primarily composed of members, properties, and methods.

## Members

Members describe the layout of the record structure of the type in memory.
This means it is the programmer's responsibility to properly order member variables with the following considerations:

- Compatibility with ABI, API, wire format of standardized packets or records
- Structure packing/padding
- Register offsets and alignment
- Reducing the size of a class for memory efficiency

Members are variables that belong to classes.

The placeholder identifier may be used to specify padding, or member may be
declared with an offset or address.

### Member Annotations

In order to effectively define special records, annotations may be used to control the size, alignment, offset, and access mode of members

- `@size(N)`
  - `N` The size of the member in bytes
- `@offset(N)`
  - `N` The offset of the member in bytes
- `@address(N)` (For shared members)
  - `N` The address of the member in bytes
- `@align(N)`
  - `N` The alignment of the member in bytes

The standard annotations are also applicable

## Properties

Properties are exactly the same as methods. The only reason they are given a distinct name is to communication intention.

Properties are methods that provide access to class state py returning references to members or by returning a query of state.

## Methods

Methods are functions

### Method Annotations

- `@final` This prevents the value from being overridden in an implementing interface ot class

### Method Implementation

Methods are implemented as function where the first parameter is the type of the class to which they belong

```mj
class StringView {

    u32 StringView::size(safe)

    bool StringView::is_equal(safe; StringView other)


    @shared
    bool StringView::MAX_SIZE(safe; StringView other)
}


u32 StringView::size(safe)
bool StringView::is_equal(safe; StringView other)


u32 size(StringView this)
bool is_equal(StringView this, StringView other)
```

## Constructors

Constructors may not call any methods until they have initialized all const members this is to prevent
memoization of pure functions from breaking their contract.

Const members are mutable within the constructor and are finalized when the constructor returns.

## Destructors

## Operator Overloading
