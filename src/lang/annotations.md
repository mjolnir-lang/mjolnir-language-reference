# Annotations

## Global

### `@target(PLATFORM)`

Used to include features for the target platform.

### `@address(BYTES)`

Used to set the address of an object or method.

### `@pure`

Used to identify methods in an interface which must be pure functions

No side effects and same return value for same arguments

### `@shared`

Used to make declarations part of the type itself

### `@api(MAJOR.MINOR)`

Used to associate a declaration with a version.

### `@deprecated(MAJOR)`

Used to remove a name from a version.

### `@internal`

Used to hide methods from an API.

### `@final`

Prevent overloading of the method.

### `@size(BYTES)`

Force an object size

### `@debug`

Used to exclude debug features from a release build

### `@ignored`

Used to exclude feature from any build

## Type

Manipulate the type.

### `@value-type`

Used to mark a type as pass by value instead of pass by reference.

## Code

## Data

Directly annotate the date, not just the variable.

## Variable

## Member

### `@offset(BYTES)`

Force a member variable offset or a virtual method index.

## Memory Fragmentation
