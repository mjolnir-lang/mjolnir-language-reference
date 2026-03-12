# Fundamental Types

The fundamental types are the most basic units of the type system. All user define types are
composed of them.

The language defines several type expression operators.

## void

The `void` type is a fundamental type which cannot be instantiated.

It is an incomplete type that cannot be completed (consequently, objects of type void are disallowed).

There are no arrays of void, nor references to void.

However, pointers to void and functions returning type void (procedures in other languages) are permitted.

## Integer Types

The integer types are fundamental types

They are fixed width. Their size does not vary with the system architecture.

There are no `size_t`, `uintptr_t`, or `int` types

## The Boolean Type

The Boolean fundamental type `bool` is always either `true` or `false`.

## The Boolean Literals

The Boolean literals are the keywords true and false

## Pointer and Reference Types

All pointers are value types. They are all implemented with the same storage.

Pointers are stored as unsigned integers. On different system architectures they may have different
bit widths. The most common sizes are 32 and 64 bits.

Because pointer sizes change depending on the target system architecture, portable code must accept
that class and record layout can change.

The syntax `T*` is equivalent to the built-in type `Ptr<T>`

- `T*` - `Ptr<T>`
- `const T*` - `Ptr<const T>`
- `T*const` - `const Ptr<T>`
- `const T*const` - `const Ptr<const T>`

The syntax `T&` is equivalent to the built-in type `Ref<T>`

## Array and Slice Types

An array is a fixed-size sequence of objects of type `T`.

The array type is written as `T[N]`. The size is a constant expression that evaluates to a `u32`.

The syntax `T[SIZE]` is equivalent to the built-in type `Array<T, SIZE>`

The syntax `T[]` is equivalent to the built-in type `Slice<T>`

## Function and Function Pointer Types

The syntax `T()` is equivalent to the built-in type `T function()`

The syntax `T()*` is equivalent to the built-in type `Function<T()>`
