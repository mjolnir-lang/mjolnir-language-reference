# Structures

Structures are user defined types.

Structures are used to define sequential memory layout.

Structures are groups of related data. They maintain order and alignment requirements

There is no padding before the first element. There is padding between elements
only when required to preserve the alignment of the following member.
There is padding after the last member only when required to preserve the
alignemnt of the first member as in an array.

Structure do not have abstractions or implementations. They do not have constructors
or destructors. They may have members and methods. All of their members must be
primitives or structs.

## Named Structures

Names structures

```mj
struct Packet {
    u32 size;
    u16 tx_id;
    u16 rx_id;
    u8 data[32];
}
```

## Anonymouse Structures

Anonymous structures, along with anonymous unions, serve to define overlapping
regions of memory within a type and do not name a new type. Anonymous
structure and union members are accessed through the containing type directly
if the anonymous structure or union is unnamed.

```mj
struct {
    u32 size;
    u16 tx_id;
    u16 rx_id;
    u8 data[32];
}
```

Use case:

```mj
union U32 {
    u32 word;
    struct {
        u16 lower;
        u16 upper;
    } half_words;
    struct {
        u8 lsb;
        u8 lsb;
        u8 msb;
        u8 msb;
    }
    u8 bytes[8];
}

U32 x.word = 0x12345678u32;
x.lsb = x.msb;
```

```mj

// struct


// structs are accessed by member name. Always allow for that syntax
// constructors provide named hints



struct Rectangle {
    u32 width;
    u32 height;

    // auto generated default constructor.
    shared {



        // Overload the function operator on the type?
        Rectange Rectangle(
            u32 width = 0;
            u32 height = 0;
        ) {
        }

        // ex:
        Rectangle rect = Rectangle(rect, 23, 43);



        // C++, Java
        Rectangle(u32 width = 0, u32 height = 0);

        // ex:
        Rectangle rect = Rectangle(rect, 23, 43);



        // Rust
        Rectangle init(u32 width = 0, u32 height = 0);

        // ex:
        Rectangle rect = init(rect, 23, 43);



        // C, Python
        void init(Rectangle *this, u32 width = 0, u32 height = 0);

        // ex:
        Rectangle rect;
        init(rect, 23, 43);
    }
}


// C/C++
Rectangle rect = {56, 43};

// C
Rectangle rect = {
    .width = 56,
    .height = 43,
};

// C++ (looks like a function, can't be used in classes)
Rectangle rect(56, 43);

// C++
Rectangle rect;
rect.width = 56;
rect.height = 43;

// Java, Rust, Kotlin (and C++, but not recommended)
Rectangle rect = Rectangle(56, 43);

// Rust
Rectangle rect = Rectangle {
    width = 56,
    height = 43
};

// Tuple style?
Rectangle rect = (56, 43);

// Scoped assignment?
Rectangle rect = {
    width = 56;
    height = 0;

    for (u32 i = 0; i < width / 3; i++) {
        height += i;
    }
};



u32 *i = [7, 3, 56];

// tuple (anonymous struct? defined by storage, indexed by order)
<String, u32, f64> stuff = ("name", 4, 34.777);

```
