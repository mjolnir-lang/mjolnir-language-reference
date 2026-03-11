# Collection Framework

Collections are useful data structures for storing and manipulationg objects.

Collections are the primary means of declaring memory usage intent at a high
level within a program.

In order to improve code reasonability, the majority of structured data should
be stored in the standard collections or custom collections which implement
the standard collection interfaces. This will create a data layer abstraction.

## Characteristics

Ownership
Movability
Sortability
Mutability
Scalability
Accessibility
Queryibility
Comparibility
Mergability
Oerdered
Topology
Growth

## Generic Collection Interfaces

### Access

- `Iterable<T>`
- `Indexable<T>`
- `Sliceable<T>`
- `Sortable<T>`
- `Viewable<T>`

### Manipulations

- `Orderable<T>`
- `Queryable<T>`

### Attributes

- `Comparable<T>`

### Meta

- `Copyable<T>`
- `Movable<T>`

## Generic Colletions

- `Box<T>`
- `Heap<T>`
- `Slab<T>`
- `Allocator<T>`
- `Array<T>`
- `Vector<T>`
- `List<T>`
- `Stack<T>`
- `Queue<T>`
- `Deque<T>`
- `PriorityQueue<T>`
- `Map<K, V>`
- `Set<K>`
- `HashMap<K, V>`
- `HashSet<K>`
- `Table<K,V>`
- `HashTable<K, V>`
- `LinkedList<T>`
- `Graph<N, E>`
- `DirectedGraph<N, E>`
- `Trie<T>`
- `Slice<T>`
- `Buffer<T>`
- `Stream<T>`

### Non-Owning

- `StackView<T>`
- `SetView<T>`
- `QueueView<T>`
- `View<T>`
- `View<T>`
- `View<T>`
- `View<T>`

## Specialized Collections

- `String<T>` - A specialization of `Vector<u8>`
