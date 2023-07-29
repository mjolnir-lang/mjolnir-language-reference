# Enumerations

They are stored as an index, pointer, or structure depending on compliance to
enum properties.

Enumerations are short-hand notation for defining a homogenous, immutable set
of constant data structures referenced by unique identifiers and stored in an
unsigned integer.

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
the members are assigned as unsigned integers in order of declaration begining with `0` and increasing in value.

Simple enumeration members may be individually annotated, but they will always have the same value.

If more members are added to the enumeration in an API update, then they must be appended to the end of the
list. If any are deprecated, then their value cannot be reused.

If a member is deprecated then it will be skipped by the incremental member assignment, and a new name or `_` should be provided to fill the space to preserve API compatibility with the following members.

## Empty Enumerations

Enumerations may have no members

## Anonymous Type Definitions

Enumerations, as with all type definitions, allow the type to be declared anonymously and/or with an instance name.

```mj
enum<IndexType> TypeName;
```

## Instance Definitions

Enumerations, as with all type definitions, allow one identifier to be defined as an instance of the type.

```mj
enum<IndexType> TypeName;
enum<IndexType> TypeName instance_name;
```

## Assignemnt

When enumerations are asigned, the scope resolution first looks for a member of the enumeration before performing implicit type conversions.

```mj
enum Color {
    RED;
    GREEN;
}

const Light RED = Light();

// Here, RED is Color::RED because enumeration members have the highest scope resolution priority.
Color color = RED;

match (color) {
    RED => ; // Same here.
    GREEEN => ;
}
```

## Forms

There are several forms of enumerations.

- Simple

```mj
enum<IndexType> TypeName instance_name {
    [(IndexType: index)] VALUE_NAME = {value, fields};
}


enum<IndexType> TypeName;
enum<IndexType> TypeName instance_name;
```

```mj
enum Month {
    JANUARY;
    FEBRUARY;
    MARCH;
    APRIL;
    MAY;
    JUNE;
    JULY;
    AUGUST;
    SEPTEMBER;
    OCTOBER;
    NOVEMBER;
    DECEMBER;
}
```

- Assigned

```mj
enum<u8> Month {
    [ 1] JANUARY;
    [ 2] FEBRUARY;
    [ 3] MARCH;
    [ 4] APRIL;
    [ 5] MAY;
    [ 6] JUNE;
    [ 7] JULY;
    [ 8] AUGUST;
    [ 9] SEPTEMBER;
    [10] OCTOBER;
    [11] NOVEMBER;
    [12] DECEMBER;
}
```

- Non-Invertable

The same index is used for multiple values. Cannot perform reverse lookup.

```mj
enum<u8> ErrorCode {
    [ 0] OKAY;
    [ 1] UNSPECIFIED_ERROR;
    [ 4] OUT_OF_MEMORY;
    [ 4] TIMEOUT;
    [15] DEADLOCK;
}
```

- Sparse

The range of assigned index values is not continuous.

```mj
enum ErrorCode {
    [ 0] OKAY;
    [ 1] UNSPECIFIED_ERROR;
    [ 4] OUT_OF_MEMORY;
    [12] TIMEOUT;
    [15] DEADLOCK;
}
```

- Structured

The enumeration has data associated with its index stored in a static table.

- Keyed

The enumeration has an explicit type for the index.

- Keyed and Structured

## Syntax

```mj
enum Month {
    JANUARY   =  1;
    FEBRUARY  =  2;
    MARCH     =  3;
    APRIL     =  4;
    MAY       =  5;
    JUNE      =  6;
    JULY      =  7;
    AUGUST    =  8;
    SEPTEMBER =  9;
    OCTOBER   = 10;
    NOVEMBER  = 11;
    DECEMBER  = 12;
}
```

```mj
struct Month {
    String name;
    String abreviation;
    u8 month_of_year;
    u8 days;
    u8 days_on_leapyear;
}


enum<u8> Month {
    [ 0] JANUARY   = {"January",   "Jan",  1, 31, 31};
    [ 1] FEBRUARY  = {"February",  "Feb",  2, 28, 29};
    [ 2] MARCH     = {"March",     "Mar",  3, 31, 31};
    [ 3] APRIL     = {"April",     "Apr",  4, 30, 30};
    [ 4] MAY       = {"May",       "May",  5, 31, 31};
    [ 5] JUNE      = {"June",      "Jun",  6, 30, 30};
    [ 6] JULY      = {"July",      "Jul",  7, 31, 31};
    [ 7] AUGUST    = {"August",    "Aug",  8, 31, 31};
    [ 8] SEPTEMBER = {"September", "Sep",  9, 30, 30};
    [ 9] OCTOBER   = {"October",   "Oct", 10, 31, 31};
    [10] NOVEMBER  = {"November",  "Nov", 11, 30, 30};
    [11] DECEMBER  = {"December",  "Dec", 12, 31, 31};
}
```

## Implementation

The layout when expressed as a structure is equivalent to:

```mj
struct Month {
    const u8 _index;


    struct _Value {
        const String name;
        const String abreviation;
        const u8 month_of_year;
        const u8 days;
        const u8 days_on_leapyear;
    }


    class _ValueIterator {
        u32 index = 0;
    }


    impl<Iterator<const Month>> _ValueIterator {
        const Month &next(safe; u32 offset = 1) {
            return (Month) index++;
        }


        const Month &previous(safe; u32 offset = 1) {
            return (Month) --index;
        }
    }


    class _Values;


    impl<Iteratable<const Month>> _Values {
        Iterator<const Month> iterator(safe) {
            return _ValueIterator();
        }


        Iterator<const Month> {[::]}(safe; i32 start = 0, i32 stop = size, i32 step = 1) {
            return _ValueIterator();
        }
    }


    shared {
        const Month JANUARY   = { 0};
        const Month FEBRUARY  = { 1};
        const Month MARCH     = { 2};
        const Month APRIL     = { 3};
        const Month MAY       = { 4};
        const Month JUNE      = { 5};
        const Month JULY      = { 6};
        const Month AUGUST    = { 7};
        const Month SEPTEMBER = { 8};
        const Month OCTOBER   = { 9};
        const Month NOVEMBER  = {10};
        const Month DECEMBER  = {11};
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
        ];

        _Values values;
    }


    const Data &{.} = _values[_index];
    const Data *{->} = &_values[_index];
    u8 {()@} = _index;
}



Month month = Month::January;
stream.print("{:s}: {:u}, {:u}", month.name, month.days, Month::data[month].days);
```

However the type and operators are overloaded, such that the type is T, while
operators apply to Data.
