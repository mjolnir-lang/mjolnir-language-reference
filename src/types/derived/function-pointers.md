# Function Pointers

Function pointers are references to functions whose identity is unknown at compile time.

Function pointers may be either virtual or non-virtual. A virtual function pointer is a handle to a
virtual function whose identity is resolved at call time, while a non-virtual function pointer is
a direct handle to a function.

There are may types of function-like objects

Functions
Methods
Lambda Expressions

## Function Pointer Type

## Function Pointer Variables

## Function Pointer Operators

Function pointers have two operators: address and call

Assignment

```mj

// Template Definition
T sum<type T>(T a, T b)

// Full Template Specialization
u32 sum<u32>(u32 a, u32 b)

// Partial Template Specialization
const T& sum<const type T&>(const T& a, const T& b)

u32(u32, u32)* sum = sum&


class MjObject {
    void ref(safe; Ctx& ctx)
    T deref<type T>(safe; Ctx& ctx)
}

void(safe MjObject&, Ctx&)* ref = MjObject::ref&
ref.(obj, ctx)

u32(safe MjObject&, Ctx&)* deref = MjObject::deref<u32>&
u32 res = deref.(obj, ctx)
```

## Function Pointer Annotations

Functions may be annotated, and pointers to functions should respect those annotations.

Annotations can be assigned to a function pointer type for simple variable definitions:

```mj
f32 add(f32 a, f32 b) => a + b
f32 sub(f32 a, f32 b) => a - b
f32 mul(f32 a, f32 b) => a * b
f32 div(f32 a, f32 b) => a / b

@pure
f32(f32, f32)* op = add&

for (u32 i = 7; i < op.(7, 8); i++) {
    // The loop condition can be optimized out because the function pointer is pure.
}


// For more complicated type expressions, use a type alias:
@pure
type<f32(f32, f32)*> Op

Op ops[] = [add&, sub&, mul&, div&]
// or use the builtin operator templates directly
Op ops[] = [::{+}<f32>&, ::{-}<f32>&, ::{*}<f32>&, ::{/}<f32>&]
f32 result = 1

for (Op op : ops) {
    result *= op.(a, b)
}
```

## Syntax

A function pointer
