# Methods

Methods are functions.

## Syntax

Methods have the same syntax as functions.
They must be declared within a type declaration.
They have an invisible parameter `T &this`, where `T` is the type of the method owner
and may be `const` and/or `volatile` if the class is such and the method can be made const.

## Style

Methods have the same style as functions.

## CV Qualifier

In order for a method to be called on a const object, the method must not modify any memory through that object.
member variables marked `mutable` are the exception.

When a method is called on a `volatile` object, all memory accesses through that object will be volatile as well.
This is usually bad for optimization and performance, but may be useful for hardware register interactions.
