# Variables

Variables represent storage locations. Every variable has a type that determines what values can be stored in the variable.

Mjolnir is a type-safe language, and the Mjolnir compiler guarantees that values stored in variables are always of the appropriate type.

The value of a variable can be changed through mutable methods and operators, such as assignment.

A variable shall be assigned before its value can be obtained.

Variables are either initially assigned or initially unassigned.

An initially assigned variable has a well-defined initial value and is always considered definitely assigned.

An initially unassigned variable has no initial value.

For an initially unassigned variable to be considered definitely assigned at a certain location, an assignment to the variable shall occur in every possible execution path leading to that location.

## Style

Variables should use snake case by convention.

```mj
u32 var = 0;
String my_string = "";
Color = rgb_color;
List<Box> boxes = List<Box>();
```

uses snake case as the conventional style for function and variable names,
in which all letters are lowercase and underscores separate words.

## Declaration

Variables must be declared before they can be used.

Variables may only be referenced within the scope in which they have been declared.

After a variable is declared, it must be initialized by an assignment.

When a variable goes out of scope, its destructor is called.

## Assignment

self-assignment.

Variable assignment is performed with the assignment operator, `=`.

There are three cases of variables.

- copy-safe - The variable is still considered initialized after assignment
- move-safe - The variable is not considered initialized after assignment
- unique - The variable cannot be moved (has a mutex, shared, cyclic references, etc.)

## Initialization

Variable initialization is required before it may be referenced.

## Default Value

Every type has a default value.

## Uninitialized

A variable is uninitialized, when it has been declared and not yet assigned, or has been destructively moved.

When a value is assigned to a variable, the variable from which the value was assigned is destructed and
is considered to be uninitialized.

```mj
u32 a = 7; // 'a' is declared and initialized
u32 b = a; // 'b' is declared and initialized, 'a' is not uninitialized

File f = File("some/path.txt"); // 'f' is declared and initialized
File g = f; // 'g' is declared and initialized, 'f' is uninitialized
```
