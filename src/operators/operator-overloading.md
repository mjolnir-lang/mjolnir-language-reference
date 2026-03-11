# Operator Overloading

Operator overloading is a means of defining functions for the standard operators.

Overloaded operators should follow the principle of least surprise, where the semantic
meaning of the operator is preserved.

In C++, operators are overloaded in the form of functions with special names.
As with other functions, overloaded operators can generally be implemented
either as a member function of their left operand's type or as non-member
functions.

These operators are not overloadable because they impact control flow:

`&&`, `||`, `^^`

These operators cannot be overloaded:

`.`, `::`, `sizeof`, `typeof`, `.*`, and `?:`

## Relational Operators

```mj
bool {>}(const U& a, const V& b)
bool {<}(const U& a, const V& b)
bool {>=}(const U& a, const V& b)
bool {<=}(const U& a, const V& b)
bool {==}(const U& a, const V& b)
bool {!=}(const U& a, const V& b)

bool {!}(U& a)
```

## Bitwise Operators

```mj
T {&}(const V& value)
T {^}(const V& value)
T {|}(const V& value)
T {>>}(u32 offset)
T {<<}(u32 offset)

void {&=}(const V& value)
void {^=}(const V& value)
void {|=}(const V& value)
void {>>=}(const V& value)
void {<<=}(const V& value)

T {~}(safe)
```

## Assignment Operators

```mj
// Move assignment
void {=}(T other)

// Copy assignment
void {=}(const T& other)

// Other type assignment
void {=}(const V& value)
```

## Compound Assignment Operators

```mj
void {+=}(const V& value)
void {-=}(const V& value)
void {*=}(const V& value)
void {/=}(const V& value)
void {%=}(const V& value)

T {++}()
T {--}()

T {++}()
T {--}()
```

## Arithmetic Operators

```mj
T {+}(const V& value)
T {-}(const V& value)
T {*}(const V& value)
T {/}(const V& value)
T {%}(const V& value)

void {+=}(const V& value)
void {-=}(const V& value)
void {*=}(const V& value)
void {/=}(const V& value)
void {%=}(const V& value)

T {+}(const U& a)
T {-}(const U& a)

T {++}()
T {--}()

T {++}()
T {--}()
```

## Miscellaneous Operators

```mj
T {=}(U& a)
T {[]}(U& a)
T {->}(U& a)
T {->*}(U& a)
T {()}(U& a)
T {*}(U& a)
T {&}(U& a)
```

## Type Cast Operators

```mj
T {()}(U& a)

// member cast
T to<T>()
T as<T>()
```

```mj
bool in()
```
