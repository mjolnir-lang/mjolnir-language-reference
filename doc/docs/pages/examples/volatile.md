# Using Volatile for Synchronization

Synchronization is required when program memory can be modified by two or more
execution contexts asynchronously. This is often understood in terms of using
multiple threads which share write-access to resources in memory, but it also
includes hardware changing memory state, co-procesors, or interrupt contexts.

One common mistake is assuming that the cv-qualifier `volatile` is sufficient
to provide unoptomized and atomic access to shared memory.

This is not correct. Volatile objects are accessed in order and verbatim within
program execution, but that does not guarentee atomicity, and does not prevent
the CPU hardware from caching a written value in one CPU and not invalidating
a cached value in another CPU when it is read or even not writing the value back
to RAM.

Usually memory mapped IO is excluded from caching and all accesses are always
read or written back to the underlying device, but for general program memory
which is cached, this will fail on multi-core systems.

The proper solution is to use architecture specific instructions for synchronization
and use memory and instruction synchronization barriers to force cache flushing
or directly invalidating cache lines.

These are difficult to model at a language level since they are usually very
platform specific in their design and philosophy.

## Language Support

- Atomic accesses
- Instruction and data barriers
- Memory access ordering
- Cache managment
- Mutexes and syncheronization primitives
- Architecture specific instructions
