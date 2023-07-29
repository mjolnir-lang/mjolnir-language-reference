# Interfaces

## Structure

## Abstraction

### Parameters and Casting

### Return values

When interfaces are returned by functions, the function must provide the size
and alignment of the implmentation, and the caller will create space for the
implementation as well as the reference to that space. The space created will
be considered a temporary.

Coroutings which store a returned interface between yield statements must
allocate space on the heap instead. The alternative would be to create space
for the largest implementation, but we should probably not rely on a finite set
of implmementations when dynamic linking is involved. The heap allocation will
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
owning and non-owning boxes. Then when we need the return value, we malloc.

```mj
interface Iterator<T> {
    const? T &next?();
}


class ListNode<T> {
    const? ListNode<T> *next;
    const? T data;

    ListNode(T &value) {
        data = value;
        next = null;
    }
}


class ListIterator<T> : Iterator<T> {
    const? ListNode<T> *node;


    ListIterator(const? List &list) {
        node = list.head;
    }


    const? T &next?() {
        const? T &value = node.value;
        node = node.next;
        return value;
    }
}


class List<T> {
    const? ListNode<T> *head;


    Iterator<const? T> iterator() {
        return ListIterator<const? T>(this);
    }
}


u32 main(const Vector<const String> &args) {
    List<u32> numbers = [0, 2, 4, 6, 8];

    for (u32 number in numbers.iterator()) {
        stdout.print("{:u32}\n", number);
    }

    return 0;
}
```

Many garbage collection languages have uniformity of object represetnation,
implemented as a pointer to heap allocated memory. This allows them to use
syntax which clearly expresses the return value or storage of interfaces.

In a C++ or Rust style language, the return value cannot be an interface
because the implementation size and alignment must be known at compile time.
It seems that the conmpiler would eb able to deduce the type in most cases,
but this does not scale to chained functions returning interfaces of functions
which may return different implementations.

For this reason these languages use a technique called boxing, where the
implementation is stored on the heap. This approch is identical to garbage
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

We don't want to loose performance. We have to manage the box syntax and resources.

### Report Size and Alignment

We must support VLAs and introduce restrictions to coroutines which store the returned
interface between yield statements or intoduce memory allocations there.

We must also restrict the implementation to returning implementations of a single type.

### Restrict to interface methods only
