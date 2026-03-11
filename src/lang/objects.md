# Objects

An object is a unit of typed storage. This is distinct from a variable in that a variable is a named
accessor of an object. A means of accessing it with limitations on ownership, and cv-qualifiers.

Objects may be accessed through multiple variables.

It is necessary that every object has one owner. A non-reference variable such that the object's lifetime
is bound to that variable and it will be destroyed when the variable goes out of scope or if the
variable is re-initialized.

Generally the term object is used to refer to an instance of a type independently of its type.
This is meaningful for simplifying discussions.

All objects have a size, minimum alignment, cv qualifiers, and an address.
These are the fundamental attributes of all types.

## Object

C++ programs create, destroy, refer to, access, and manipulate objects.

An object, in C++, has

- size (can be determined with sizeof);
- alignment requirement (can be determined with alignof);
- storage duration (automatic, static, dynamic, thread-local);
- lifetime (bounded by storage duration or temporary);
- type;
- value (which may be indeterminate, e.g. for default-initialized non-class types);
- optionally, a name.

The following entities are not objects: value, reference, function, enumerator, type, non-static
class member, template, class or function template specialization, namespace, parameter pack, and
this.

A variable is an object or a reference that is not a non-static data member, that is introduced by a
declaration.
