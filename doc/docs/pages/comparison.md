# Language Comparison

Why create yet another programming language, especially now that systemms
programming languages are well established? Because.

Several programming languages have heavily inspired Mjolnir.

Java, C, C++, Rust, Kotlin, and Python

## C

### Pros

- Manual memory management

### Cons

- bad variadic args
- header files
- undefined behavior
- variable width types
- char type
- lacking standard library
- tied to posix
- global symbols
- bad syntax
- metaprogramming with macros
- confusing rules for memory barriers and thread safety
- not a concurrent language
- bad build system

## C++

### Pros

- Manual memory management

### Cons

- perfect forwarding is a language defect!
- type casting
- no lazy class initialization for arrays
- okay variadic args
- header files
- bad generic type system
- dynamic memory management
- exceptions
- ugly standard library
- undefined behavior
- variable width types
- char type
- lacking standard library
- tied to posix
- global symbols
- bad syntax
- metaprogramming with macros
- confusing rules for memory barriers and thread safety
- not a concurrent language
- overloaded syntax instead of direct language support
- bad build system

## Rust

### Pros

- is a systems language
- no header files
- better build system
- good use of ignore placeholder

### Cons

- memory management gets in the way
- strange syntax

## Java

### Pros

no header files
Good generic type system

### Cons

- virtual machine
- memory management gets in the way
- verbose syntax
- bad build systems
- not a systems language

## Python

### Pros

- multple returns
- good use of ignore placeholder
- simple syntax
- good variadic args

### Cons

- whitespace
- interpreted
- GIL
- duck typed
- not a systems language
- no enums

## Add

- relative pointers (offsets)
- generic contracts based on usage
- shared partial generic code
- tuple return types
- parameters are execution
- no null terminatred strings
- no char type
- added type units

- auto const method transformation

- no diamond inheritance anti pattern
- interfaces can be instantiated directly
- execute deterministic code

- architecture access class
- program meta class
- memory profile class

- continue (loop-next)
- break (loop-done)

- yield (generator-next)

- return (function-pass, generator-done)
- throw (function-fail)

## Memory

C and C++ have good and bad memory management. It is explicit, but full of undefined behavior.

All language lack the features I want.

## Types

C/C++ have the best type system and syntax for systems programming languages,
but they do not have strong memory models for their types.

Java doesn't have anything special.

Rust depends on explicitly type aliasing to support derived types. It has bad type syntax.

Python does not have a type system, but its type hints are pretty good. The union/variant container is a good idea.

## Classes and Inheritance

C does not have OOP as a language feature.

C++ has classes, but multiple inheritance is a problem

Java only has classes, and the syntax is very verbose.

Rust uses records and implementations. It does not have default implementations.

Python has a good OOP model.

## Build Systems

C and C++ projects require compilation of each source file before linking them together.
There are many versions of each language, many flags, header and libbrary paths.
The quest to rebuild only thos files that have been modified has resulted in many build
systems. There are many compilers with diferent features.

Java also has a few large build systems. These are not easy to configure. The libraries for Java
are dificult to manage.

Python has both a package manager and a relative library import system. Unfortunately,
the relative import system is exceedingly convoluted and difficult to use.

Rust uses a package manager and relies heavily on its integrated library system. It uses a top level
source file and directory structure to direct compilation.

I think libraries should only be specified by path, and the compiler shpuld handle everything
when given a single top level source file.
