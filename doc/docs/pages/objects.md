# Objects

Objects are the fundamental type of all types.

Generally the term object is used toi refer to an instance of a type independantly of its type.
This is meaningful for simplifying discussions.

All objects have a size, minimum alignment, cv qualifiers, and an address.
These are the fundamental attributes of all types.

## Definitions

Many terms have a specific meaning when used in reference to the Mjolnir programming language.

- `Object` - An object is a unit of memory associated with a type.
- `Variable` - A variable is a named objects.
- `Type` - A type is a named set of operations and contraints that determine the nature of an object.
- `Fundamental Type` - A fundamental type is a type which is not composed of other types.
- `Type System` - The type system is the set of rules by which types are defined and used.
- `Class` - A class is a category of user defined type which encapsulates data and implementes interfaces.
- `Interface` - An interface is a category of user defined type which cannot be instantiated directly, but defines a set of methods by which a class may be considered a subtype.
- `Subtype` - A subtype, derived type, is a type which fulfills the minimum constraints of another type.
- `Supertype` - A supertype, base type, is a type which
- `Overload` - An overload, or overloading, is the reuse of an identifier in a function context where the function called is determined by the types of the function arguments.
- `Parameter` - A parameter is a variable defined in the function declaration.
- `Identifier` - An identifier is a syntactic token used to identiify either a keyword, variable, or type.
- `Operator` - An operator is a special function that uses a symbol in place of an identifier and follows special syntax rules for operands. Operators depend on the type of their operands to determine which overload to call.
- `Function` - A function is a segment of program code.
- `Method` - A method, or member function, is a function which is a member of a type.
- `Property` - A property, or member variable, is a variable which is a member of a type.
- `Member` - A member is anything that is a component of a type.
- `Declaration` - A declaration is a statement which creates a new type or variable.
- `Definition` - A definition is an association of a value or expression with a variable or type.
- `Assignemnt` - Assignment is the action of moving memory from one object to another.
- `Enumeration` - An enumeration, or enum, is a user defined type accosiated with a fixed set of named values.
- `Union` - A union is a user defined type which provides overlapping storage for members.
- `Variant` - A variant is a union which also keeps track of which member was last assigned.
- `Structure` - A structure, or struct, is a user defined type which provides member grouping and access.
- `Varadic Argument` - A variadic argument is an argument which has unknown type and number of elements.
- `Statement` - A statement is a unit of program code.
- `Expression` - An expression is a sequence of operations which result in a value.
- `Scope` - A scope is a context in which names are mapped to types and variables.
- `Pointer` - A pointer is an address.
- `Reference` - A reference is an alias of an object, usually implemented as a pointer or optimized out.
- `Constant` - Constant is a type qualifier which prevents the compiler from modifying memory through that type and provides a guarantee that memory will not be changed by the compiler.
- `Volatile` - Volatile is a type qualifier which causes the compiler to assume that all memory accessed through that type may have changed.
- `Thread` - A thread is a sequential execution context with a call stack
- `Program` - A program is an executable software file with a single entry point
- `Process` - A process is an execution context of a program
- `Coroutine` - A coroutine is a suspendable and resumable function used for cooperative multithreading
- `Generator` - A generator is a subset of coroutine which yields values until it is exhausted
- `Iterator` - An iterator is a reference object by which iteration over a collection is performed
- `String` - A string is a sequence of UTF-8 characters
- `Byte` - A byte is 8 bits
