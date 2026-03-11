# Enumerations

They are stored as an index, pointer, or structure depending on compliance to
enum properties.

Enumerations are short-hand notation for defining a homogenous, immutable set
of constant data structures referenced by unique identifiers and stored as an
unsigned integer index.

Enumerations define an implicit cast to their index value.

An enum is an array of any static type with set values corresponding to an index.

## Example

Enumerations are closed sets of values of a single type.

They are used to define constant members and a finite set of options.

They can define each state in a state machine or the months on the year.

A enumeration is usually defined with the `enum` keyword followed by a type name.
It is common to also declare the index type as a generic on the `enum` keyword.
Usually as the `u8` type for the index.

When an index is given, and the enum is contiguous and mapped 1-to-1, then the index will be used as the enum member directly.

Enumerations have several optional features which provide more explicit control over their representation and usage.

First, enumerations may have an optional index type. The simple form only requires an identifier for each member and
the members are assigned as unsigned integers in order of declaration beginning with `0` and increasing in value.

Simple enumeration members may be individually annotated, but they will always have the same value.

If more members are added to the enumeration in an API update, then they must be appended to the end of the
list. If any are deprecated, then their value cannot be reused.

If a member is deprecated then it will be skipped by the incremental member assignment, and a new name or `_` should be provided to fill the space to preserve API compatibility with the following members.

## Empty Enumerations

Enumerations may have no members

## Anonymous Type Definitions

Enumerations do not allow the type to be declared anonymously.

## Instance Definitions

Enumerations, as with all type definitions, allow one identifier to be defined as an instance of the type.

```mj
enum<IndexType> TypeName instance_name
```

## Assignment

When enumerations are assigned, the scope resolution first looks for a member of the enumeration before performing implicit type conversions.

```mj
enum Color {
    RED
    GREEN
}

const Light RED = Light()

// Here, RED is Color::RED because enumeration members have the highest scope resolution priority.
Color color = RED

match (color) {
    RED =>  // Same here.
    GREEN => 
}
```

## Forms

There are several forms of enumerations.

### Type Enumeration

Depends on an existing type.

```mj
struct Month {
    StringView name
    StringView abbreviation
    u8 month_of_year
    u8 days
    u8 days_on_leap_year
}

enum Month {
    JANUARY   = {"January",   "Jan",  1, 31, 31}
    FEBRUARY  = {"February",  "Feb",  2, 28, 29}
    MARCH     = {"March",     "Mar",  3, 31, 31}
    APRIL     = {"April",     "Apr",  4, 30, 30}
    MAY       = {"May",       "May",  5, 31, 31}
    JUNE      = {"June",      "Jun",  6, 30, 30}
    JULY      = {"July",      "Jul",  7, 31, 31}
    AUGUST    = {"August",    "Aug",  8, 31, 31}
    SEPTEMBER = {"September", "Sep",  9, 30, 30}
    OCTOBER   = {"October",   "Oct", 10, 31, 31}
    NOVEMBER  = {"November",  "Nov", 11, 30, 30}
    DECEMBER  = {"December",  "Dec", 12, 31, 31}
}
```

### Enumerated Structure Type

Creates a new type.

```mj
enum<u8> Month {
    StringView name
    StringView abbreviation
    u8 month_of_year
    u8 days
    u8 days_on_leap_year


    [ 1] JANUARY   = {"January",   "Jan",  1, 31, 31}
    [ 2] FEBRUARY  = {"February",  "Feb",  2, 28, 29}
    [ 3] MARCH     = {"March",     "Mar",  3, 31, 31}
    [ 4] APRIL     = {"April",     "Apr",  4, 30, 30}
    [ 5] MAY       = {"May",       "May",  5, 31, 31}
    [ 6] JUNE      = {"June",      "Jun",  6, 30, 30}
    [ 7] JULY      = {"July",      "Jul",  7, 31, 31}
    [ 8] AUGUST    = {"August",    "Aug",  8, 31, 31}
    [ 9] SEPTEMBER = {"September", "Sep",  9, 30, 30}
    [10] OCTOBER   = {"October",   "Oct", 10, 31, 31}
    [11] NOVEMBER  = {"November",  "Nov", 11, 30, 30}
    [12] DECEMBER  = {"December",  "Dec", 12, 31, 31}
}
```

### Simple Enumeration

The index is the value.

```mj
enum<u8> ErrorCode {
    OKAY
    UNSPECIFIED_ERROR
}
```

### Non-Invertible

The same index is used for multiple values. Cannot perform reverse lookup.

```mj
enum<u8> ErrorCode {
    [ 0] OKAY
    [ 1] UNSPECIFIED_ERROR
    [ 4] OUT_OF_MEMORY
    [ 4] TIMEOUT
    [15] DEADLOCK
}
```

### Sparse

The range of assigned index values is not continuous.

```mj
enum<u8> ErrorCode {
    [ 0] OKAY
    [ 1] UNSPECIFIED_ERROR
    [ 4] OUT_OF_MEMORY
    [12] TIMEOUT
    [15] DEADLOCK
}
```

### Keyed

The enumeration has an explicit type for the index.

## Syntax

```mj
enum<u8> Month {
    StringView name
    StringView abbreviation
    u8 month_of_year
    u8 days
    u8 days_on_leap_year


    [ 0] JANUARY   = {"January",   "Jan",  1, 31, 31}
    [ 1] FEBRUARY  = {"February",  "Feb",  2, 28, 29}
    [ 2] MARCH     = {"March",     "Mar",  3, 31, 31}
    [ 3] APRIL     = {"April",     "Apr",  4, 30, 30}
    [ 4] MAY       = {"May",       "May",  5, 31, 31}
    [ 5] JUNE      = {"June",      "Jun",  6, 30, 30}
    [ 6] JULY      = {"July",      "Jul",  7, 31, 31}
    [ 7] AUGUST    = {"August",    "Aug",  8, 31, 31}
    [ 8] SEPTEMBER = {"September", "Sep",  9, 30, 30}
    [ 9] OCTOBER   = {"October",   "Oct", 10, 31, 31}
    [10] NOVEMBER  = {"November",  "Nov", 11, 30, 30}
    [11] DECEMBER  = {"December",  "Dec", 12, 31, 31}
}
```

## Implementation

The layout when expressed as a structure is equivalent to:

```mj
@value-type
struct Month {
    const u8 _index


    struct _Value {
        const StringView name
        const StringView abbreviation
        const u8 month_of_year
        const u8 days
        const u8 days_on_leap_year
    }


    class _ValueIterator {
        u32 index = 0
    }


    impl<Iterator<const Month>> _ValueIterator {
        const Month& next(safe; u32 offset = 1) {
            return (Month) index++
        }


        const Month& previous(safe; u32 offset = 1) {
            return (Month) --index
        }
    }


    class _Values


    impl<Iterable<const Month>> _Values {
        Iterator<const Month> iterator(safe) {
            return _ValueIterator()
        }


        Iterator<const Month> {[::]}(safe; i32 start = 0, i32 stop = size, i32 step = 1) {
            return _ValueIterator()
        }
    }


    shared {
        const Month JANUARY   = { 0}
        const Month FEBRUARY  = { 1}
        const Month MARCH     = { 2}
        const Month APRIL     = { 3}
        const Month MAY       = { 4}
        const Month JUNE      = { 5}
        const Month JULY      = { 6}
        const Month AUGUST    = { 7}
        const Month SEPTEMBER = { 8}
        const Month OCTOBER   = { 9}
        const Month NOVEMBER  = {10}
        const Month DECEMBER  = {11}
        const _Value _values[12] = [
            {"January",   "Jan",  1, 31, 31},
            {"February",  "Feb",  2, 28, 29},
            {"March",     "Mar",  3, 31, 31},
            {"April",     "Apr",  4, 30, 30},
            {"May",       "May",  5, 31, 31},
            {"June",      "Jun",  6, 30, 30},
            {"July",      "Jul",  7, 31, 31},
            {"August",    "Aug",  8, 31, 31},
            {"September", "Sep",  9, 30, 30},
            {"October",   "Oct", 10, 31, 31},
            {"November",  "Nov", 11, 30, 30},
            {"December",  "Dec", 12, 31, 31},
        ]

        _Values values
    }


    const Data &{.} = _values[_index]
    const Data *{->} = &_values[_index]
    u8 {()} = _index
}



Month month = Month::January
stream.print("{:s}: {:u}, {:u}", month.name, month.days, Month::data[month].days)
```

However the type and operators are overloaded, such that the type is T, while
operators apply to Data.
