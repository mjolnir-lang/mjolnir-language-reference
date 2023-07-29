# Classes

Classes are user defined types.

## Class Type Definition

The type definition of a Class uses the `class` keyword with the following syntax:

```mj
class Rectangle {
    u32 width;
    u32 height;

    u32 width() {
        return width;
    }

    u32 height() {
        return height;
    }

    u32 area() {
        return width * height;
    }

    void set_width(u32 width) {
        this.width = width;
    }

    void set_height(u32 height) {
        this.height = height;
    }

    void resize(u32 width, u32 height) {
        this.width = width;
        this.height = height;
    }
}
```

## Generic Class Type Definition

```mj
class Rectangle<T> {
    T members;

    void methods(T &arg) {
    }
}
```

## Class Type

The class type does not expose member variables.

It uses properties as a homogenous style since some
properties require code beyond a return statement.

## Constructors and Destructors

Classes must be initialized before use, and destroyed before they leave scope.

### Const Constructors

When initializing a constant object, the constructor inherits the const-ness of the assigned
storage location. If the variables being initiaslized has CV qualifiers, then the constuctor
must inherit them.

This is the only instance where the parameter list is mutated to support potentially
reduced constraints on the CV qualifiers.

### Example

Given the definitions of the two classes `StringView` and `String` below, there
is an interesting problem that arises from CV-qualifier inheritance.

```mj
class StringView {
    u8 *data;
    u32 size;

    StringView(u8 *data, u32 size) {
        this.data = data;
        this.size = size;
    }
}

class String {
    u8 *data;
    u32 size;

    StringView {[:]}(u32 start, u32 stop) {
        return StringView(&data[start], stop - start);
    }
}
```

The code below demonstates the problem.

```mj
String letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const String const_letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
StringView hex_digits = letters[0:6];
const StringView const_hex_digits = const_letters[0:6];
```

Here, the view over `letters` may return either a const or a mutable `StringView`.
The `StringView` constuctor may accept the pointer to the string data.

However, the view over `const_letters` may only return a const `StringView`.
The `StringView` constructor cannot accept the pointer to the constant string data, as is.

There are three approaches which would address the problem

1. Create a const constructor explicitly
    - This breaks the CV qualifier inheritance pattern
2. Allow const inheritance in constuctors
    - This
3. Overload the slice function with a `const StringView` return type
    - This breaks the CV qualifier inheritance pattern

### Member Initialization

Members are initialized by order of dependency.

Constant members are mutable until after the contructor has returned.

```mj
class Rectangle {
    u32 width;
    u32 height;

    // User defined constructor
    Rectangle(u32 width, u32 height) {
        this.width = width;
        this.height = height;
    }

    // Default constructor
    Rectangle() {
        this.width = 0;
        this.height = 0;
    }

    // Copy constructor
    Rectangle(const Rectangle &other) {
        this.width = other.width;
        this.height = other.height;
    }

    // Move contructor
    Rectangle(Rectangle other) {
        this = other;
    }

    // Move assignment
    Rectangle &{=}(Rectangle other) {
        this.width = other.width;
        this.height = other.height;
        return this;
    }

    // Destructor
    ~Rectangle() {
    }
}
```

### Calling Constructors

```mj
Rectangle rect = Rectangle(3, 4);

u32 width = rect.width();

rect.resize(7, 6);

rect.set_width(5);

u32 area = rect.area();
```

## Shared

## The `this` Keyword

## Memory Layout

Class Members and properties are stored in each instance.

Classes are encapsulated data.

All members are private.

Shared members are can be grouped by template type or global.
