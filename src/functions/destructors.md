# Destructors

Destructors are special functions called when an object goes out of scope.

If the destructor is called manually, the object is marked as uninitialized from that point onward and must not be used
again until it has been re-initialized. It's address may be taken. If it was destroyed in a sub-scope, it must be re-initialized before it leaves that scope.

Uninitialized objects must be initialized before they leave their scope.

Constructors must initialize all class members before returning.

If a constructor fails, it must leave its object in an uninitialized state.

A destructor is called when an object goes out of scope.
A destructor is called when an object is overwritten and .

A Move Constructor shall destroy take the other object by value.
A Move Assignment Operator shall:
    1. destroy itself
    2. move the other objects resources to itself
    3. mark the other object as uninitialized explicitly to prevent the destructor from being called when the plundered object goes out of scope or allow the plundered object to go out of scope if the destructor ought to be called.

In C++, the move assignment operator must leave the plundered object in a valid state so the calling scope may call its
destructor.

## Value Types

A value type is always passed by copy and moving it does not destroy the original object.

A value type shall not have a move constructor or a move assignment operator.

A value type is not required to be trivially copyable. They may have managed resources.

A value type may be either movable or immovable.

A value type does not have a destructor.

## Class Types

## Structures

A Structure may have a destructor.

A Structure does not have a constructor because it uses structured initialization.

### Struct Keyword

The struct keyword can be used without a type name to structure members within a parent scope, so
its members belong to the parent scope and the parent scope is responsible for calling the
destructor for each of its members.

## Union

A Union shall not contain any members that have a destructor, because it cannot track which member
is valid at the time of destruction.

A Union is declared with a type name and may be declared outside of a containing type (class,
struct, union).

A Union shall not have a constructor because it uses structured initialization.

### Union Keyword

The union keyword can be used without a type name to structure members within a parent scope, so
its members belong to the parent scope and the parent scope is responsible for calling the
destructor for each of its members.

It may contain members that have a destructor.
