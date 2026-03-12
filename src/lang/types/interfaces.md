# Interfaces

Interfaces are abstractions that standardize the operations that may be
performed on an implementing type, whether that be a class or another interface.

Interfaces are primarily composed of method declarations which an implementation
is required to define.

Implementations may be referenced through an interface. This will limit the capabilities of
that implementation to only what is declared in the interface while preserving the
functionality of the implementation.



Interfaces are pure abstractions used to present a homogenous view of derived
classes. Interfaces may contain method declarations, methods, and shared scopes,
but they may not contain members or properties.

Interfaces are references implemented as 2 pointers, one for the class instance
and the other for the v-table. Since interfaces carry the overhead of an extra
pointer dereference, it is reasonable to use a wide pointer representation
instead of a reference to an interface containing a reference to the class
instance.

abstract classes carry state which causes problems with inheritance

diamond inheritance pattern
mutex wrapping

function overload drill down should be supported by default

## Syntax

Interfaces are defined using the `interface` keyword.

```mj
interface MyInterface
```

## Structure

## Abstraction

### Parameters and Casting

### Return values

When interfaces are returned by functions, the function must provide the size
and alignment of the implementation, and the caller will create space for the
implementation as well as the reference to that space. The space created will
be considered a temporary.

Coroutines which store a returned interface between yield statements must
allocate space on the heap instead. The alternative would be to create space
for the largest implementation, but we should probably not rely on a finite set
of implementations when dynamic linking is involved. The heap allocation will
destroyed with the coroutine.

This introduces a precedent for special case heap allocation. While any class
may have perform heap allocation, the structure of a coroutine does not make
this case obvious.

Really the issue is non-obvious dynamic stack allocation. Unfortunately, this
is the primary structure of generators.

Metadata for the size and alignment may not be known until the function is
executed, due to nested returns of interfaces.

One solution is to only support the interface return values within interfaces,
and require all implementations to return an implementation of that interface.

This seems reasonable.

### Or this

Use auto boxing when assigning the return value to an interface type. This gives
a purpose to the plain interface type. But is it always boxed? There should be
owning and non-owning boxes. Then when we need the return value, we `malloc()`.

```mj
interface Iterator<T> {
    T&? next()
}


class ListNode<T> {
    ListNode<T>* next
    T data


    ListNode(T& value) {
        data = value
        next = null
    }
}


class ListIterator<T> {
    ListNode<T>* node


    ListIterator(List &list) {
        node = list.head
    }
}


impl<Iterator<T>> ListIterator<T> {


    T&? next() {
        T& value = node.value
        node = node.next
        return value
    }
}


class List<T> {
    ListNode<T> *head


    Iterator<T> iterator() {
        return ListIterator<T>(this)
    }
}


void? main(StringView[] args) {
    List<n32> numbers = [0, 2, 4, 6, 8]

    for n32 number in numbers.iterator() {
        stdout.write("\(number)\n")
    }
}
```

Many garbage collection languages have uniformity of object representation,
implemented as a pointer to heap allocated memory. This allows them to use
syntax which clearly expresses the return value or storage of interfaces.

In a C++ or Rust style language, the return value cannot be an interface
because the implementation size and alignment must be known at compile time.
It seems that the compiler would eb able to deduce the type in most cases,
but this does not scale to chained functions returning interfaces of functions
which may return different implementations.

For this reason these languages use a technique called boxing, where the
implementation is stored on the heap. This approach is identical to garbage
collecting languages, though we need to do some extra work to clean up
after we finish with the returned implementation. In a C++ styled language we
can use the previously unused type of the interface directly as a box type
with automatic resource release.

However we don't want to loose the performance gains of specific type inference.
If a class can directly return an implementation, the method will satisfy the
signature be auto generating a boxed version of the method. When called on the
implementation the more performant version will be called automatically.

## Other Failed Solutions

### Worst Case

Always provide for the largest and most alignment restrictive implementation.

The issue is that dynamic linkage may introduce implementations with greater requirements.

### Always Box

We don't want to lose performance. We have to manage the box syntax and resources.

### Report Size and Alignment

We must support VLAs and introduce restrictions to coroutines which store the returned
interface between yield statements or introduce memory allocations there.

We must also restrict the implementation to returning implementations of a single type.

### Restrict to interface methods only

## Default

```mj
interface ApiPacket {

    @pure
    ApiPacketType packet_type(safe)

    @pure
    u16 size(safe)

    @pure
    u8 sequence_number(safe)
}
```

## Virtual Members

```mj
interface ApiPacket {

    @virtual
    u16 size

    @virtual
    u8 seq

    @virtual
    ApiPacketType type


    @final
    ApiPacketType packet_type(safe) => type

    @final
    u16 size(safe) => size

    @final
    u8 sequence_number(safe) => seq
}
```

## Overlays

Interfaces do not have any restrictions on their derived type structure, but it may be efficient for
some applications to require a consistent member variable layout.

```mj
interface ApiPacket {
    u16 size
    ApiPacketType type

    @offset(4)
    u8 seq


    @final
    ApiPacketType packet_type(safe) => type

    @final
    u16 size(safe) => size

    @final
    u8 sequence_number(safe) => seq
}
```

## RTTI

Interfaces use wide pointers by default, but it may be more efficient for some applications to
store the type ID explicitly within the implementing type, either as a member overlay, a
virtual member, or a method.

```mj
interface ApiPacket {
    ApiPacketType type
    u8 seq
    u16 size


    @final
    ApiPacketType packet_type(safe) => type

    @final
    u16 size(safe) => size

    @final
    u8 sequence_number(safe) => seq

    @shared
    @internal
    const VTable& vtable(safe) {
        match (type) {
            CMD => return ApiCmdPacket::vtable<ApiPacket>()
            DATA => return ApiDataPacket::vtable<ApiPacket>()
            ? => unreachable
        }
    }
}
```
