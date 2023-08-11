# Class Definitions

## Class Type Definition

The type definition of a Class uses the `class` keyword with the following syntax:

```mj
class Rectangle {
    u32 width
    u32 height

    u32 width() => width

    u32 height() => height

    u32 area() => width * height

    void set_width(u32 width) {
        this.width = width
    }

    void set_height(u32 height) {
        this.height = height
    }

    void resize(u32 width, u32 height) {
        this.width = width
        this.height = height
    }
}
```

## Generic Class Type Definition

```mj
class Rectangle<T> {
    T members

    void methods(T &arg) {
    }
}
```
