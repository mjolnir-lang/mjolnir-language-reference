# Function Philosophy

Functions should do one thing.

Named using verbs.

Do not take boolean parameters because they are ambiguous.

Avoid default arguments, use structures for config data or bitfields for named bool values.

Use distinct types for parameters to avoid mistakes.

Clearly communicate ownership.

Clearly communicate failure conditions and recovery.

Clearly communicate uninitialized parameter status.

## Function Pointers

## Syntax

Functions are not types and they are not data.

There are three classifications of program elements: code, type, and data

Data is the value of an object

Type is the identity and definition of an object data and code

Code is the set of expressions used to transform the data following the rules of the type system.

Functions have distinct operators and representation within th compiled program.
They are called with arguments and can return values and their addresses can be stored for
dynamic calling.

Functions have only two operators, `fn&` and `fn()`.

Function pointers are objects whose type is a pointer to a function type. Function pointers can be
assigned and the referenced function can be called.
