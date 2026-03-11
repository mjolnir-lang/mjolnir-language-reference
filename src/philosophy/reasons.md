# Reasons

## Single Pass Compilation

In C++, types, functions, and other items cannot be used unless they are declared or defined.

There are some situations where forward declarations can expose sufficient information to allow
the use of items in out-of-order contexts, but for the most part, the strict ordering of items is a
detriment to complex hierarchies of type structure or compile time evaluation.

For example, a type cannot contain a static member of itself because it is not completely defined
within it's own definition. CRTP can be used to bypass this.

Forward declarations are sufficient for some things, but they are ugly and deceptive. They necessitate
unnatural and unintuitive layout of items in source files.

## Separate declarations and definitions

In C++, the separation of heads and sources is a legacy design that increases boiler plate.

## Templates in header files

C++ templates must be continually re-parsed because they are header only. They also have boilerplate
overhead for specialization and inline variable definitions.

## Sharing of constant global data

Variables in header files must be either inline or extern and neither really satisfies the goal of
exposing shared storage with constant values.

## Virtual Method Table pointer in the type record

Virtual function pointer tables embedded within type record structures make polymorphic fixed record
types impossible. Using fat pointers is better, but can add overhead if there are more references
than instances. I prioritize explicit record layout.

## Bitfields

The layout of bitfields is implementation defined. That's a simple fix.

## Implementation defined integer sizes

This is a legacy of poor design. All modern languages have moved to fixed size integers because
it is important for safe calculations and record layout when writing portable code.

## Strict aliasing rules/Reinterpret casts

The strict aliasing rule in C++ prevents several key optimizations that programmers often want to
do in constant expression contexts.

## Thread based model

Coroutines are better that threads. A mixed environment leads to colored function poisoning.
All functions must be suspendable. Threads are still supported and necessary for blocking
calls to external code.

## Enums

Enums and enum classes are too limited. Enums should be able to contain metadata and operators.

## Structures and classes

Structures and classes in C++ are basically identical. Structures should be for layout and compound
data types. Classes and interfaces should be for actual objects.

## Abstract classes

Abstract classes and virtual inheritance are not good design in C++ because of the diamond
anti-pattern and padding overhead. They also enforce layout that might not be desirable.

Composition should be used for enforced layout, but pure interfaces should be used for polymorphism.

## Syntax should be semantic

Code snippets should be just as correctly highlightable and readable as full programs. Semantic
syntax is best because it enforces consistent style and increases reading comprehension.

## Omitted curly braces for single line control statements

Control statements should always use block statements to wrap single line statements to increase
consistency and avoid mistakes.

## Overloaded Brace Initialization

## Ambiguous Brace Initialization

## Null terminated String Literals

## Intrusive linter warnings while typing

Don't emit warnings or errors while typing. We know there is a problem and it's annoying.
Don't highlight invalid words, numbers, strings, or operators. Those can be the normal colors.

There are only invalid module names, mixed case identifiers, an operators
