# The Iterator Pattern

There is at most one next item. If you need to make decisions about traversal withing the loop, you
should use a cursor.

The iterator patten is a behavioral pattern which allows traversal over a collection of elements
without exposing the container API.

Iteration abstracts the element access and container traversal method but there may be many
different traversal orders or operations that affect the iterator contract.

Iteration is heavily specialized by the traversal method, access mode, and other constraints
required by the application, so iterators are categorized based on these dimensions.

- Single-pass
- Multi-pass
- Forward
- Contiguous
- Bidirectional
- Random-access
- Double-ended
- Skippable
- Seekable
- Splittable
- Sliceable
- Mutable (insert/remove on collection)
- Non-invalidatable
- Stable
- Ordered
- Unordered
- Fallible (fail without being exhausted)
- Infallible
- Sized
- Bounded
- Unbounded

Access Methods

- Readable
  - Reference
  - Mutable Reference
  - Copy
  - Move (single-pass)
- Writable
  - Replacement
  - Initialization (single-pass)

Capabilities

- Filterable
- Reversible
- Chainable

Some aspects of iteration are also dependent on the access mode

Invalidation occurs when the collection has changed without the iterator's knowledge.

## Traversal

Traversal is defined in the selection of an iterator for a particular collection.

Some examples include: forward, reverse, ordered/unordered, depth/breadth-first in the case of trees.

Collections generally have a primary traversal method since they are designed for specific access
patterns.

Sequential collections or lazy generators generally iterate over their elements from beginning to
end, whereas tree-like structures, such as file systems, can be traversed depth-first or breadth-
first. Graphs require specific algorithms.

### Directionality

#### Forward

#### Bidirectional

#### Random Access

#### Contiguous

### Passes

#### Single-pass

#### Multi-pass

## Operations

### Element Access

#### Lookahead

Can the iterator return a value without advancing (buffered, random-access, bidirectional, idempotent)

#### Dereference Idempotency

Will the same value be returned if the iterator is accessed multiple times without advancing

### Mutability

#### Invalidation

Can the iterator be invalidated

### Ownership

#### Borrowed

#### Owned

#### Shared

#### Unique

## Termination

### Finite

#### Sized

#### Terminated

### Infinite

### Must complete

### Abortable

## Problem

## Solution

### Interface vs Template

Iterators directly integrate into for-loop semantics.

Iterators are ideally statically bound, but can be accessed dynamically through their interface.

## Variations

### Python

Python leverages exception semantics and generators to provide iteration. This greatly simplifies
the implementation and ergonomics of the iteration pattern.

```py
class ThreeThings:
    __slots__ = ("_a", "_b", "_c")

    def __init__(self, a, b, c) -> None
        self._a = a
        self._b = b
        self._c = c


    def __iter__(self) -> 
        yield self._a
        yield self._b
        yield self._c
        raise StopIteration
```

```py
names = ["Alice", "Bob", "Charlie"]

for name in names:
    print(name)
```

### Rust

### C++

#### C++11

- Iterator pairs
- Category tags
- Traits-based detection
- Compile-time structural duck typing

#### C++20
