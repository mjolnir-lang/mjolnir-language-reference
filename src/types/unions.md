# Unions

Unions have the space requirements of the largest member and alignment of the
member with the largest alignment, usually the same member.

Any member may be accessed regardless of the last member stored. This allows
the memory of other types to be accessed.

```mj
union {
    u32 number;
    Rectangle shape;
    Box *pointer;
}
```
