# Optimizations and Algorithms

## Compiler Optimizations

## Compiler Transformations

- Tail recursion elimination
- Inlining
- Unrolled recursive function calls

## Static Analysis

- Static analysis of dynamic memory usage
- Static analysis of function calls
- Runtime analysis of memory usage

Functions have call frames

Call frames have a constant size

Call frames are allocated on the heap.

Nesting call frames withing thw calling frame can reduce the number of heap
allocations required.

Programs may be one of the following categories:

1. No recursive function calls
    - Single call stack
2. No multi-tasking
    - Single call stack
3. Linked call stack
    - Heap allocated call stack
    - Repeated boundary crossing can be expensive
4. Use run time recursive call guards
    - Heap allocated call stack (or maybe single call stack if recursion is manageable)
5. No
    - Single call stack
6. Change all recursive functions into iterative functions
    - Single call stack
7. Allocate the call stack for each recursive function after using worst case call stack nesting
    - This may significantly over allocate for the general case
8. Allocate the call stack for each recursive function after using likely case call stack nesting
