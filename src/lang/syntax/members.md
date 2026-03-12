# Members

A member is any of the following

- variable declaration
- function declaration or definition
  - shared member function
  - special member function
    - constructor
      - default constructor
      - copy constructor
      - move constructor
      - user-defined constructor
    - destructor
    - operator overload
- type declaration
  - class declaration
  - structure declaration
  - enumeration declaration
  - bitfield declaration
- type definition
  - class definition
  - structure definition
  - enumeration definition
  - bitfield definition
  - type alias definition
- structured layout
  - anonymous struct
  - anonymous union
  - anonymous bitfield

## members

## shared members

Inside a class definition, the annotation `@shared` declares members that are not bound to class
instances.

```mj
class MyType {

    @shared
    u32 shared_function() {
        return 7
    }
}
```

```mj
void main() {
    u32 result = MyType::shared_function()

    // Shared functions can be called on instances of the type, but the instance is not passed to
    // the shared function.
    MyType thing
    thing.shared_function()
}
```
