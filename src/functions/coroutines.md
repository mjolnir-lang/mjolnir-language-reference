# Coroutines and Generators

Generator -
Coroutine -
Subroutine - A named expression with no parameters and no return value
Procedure - A named expression with no parameters and no return value
Function/Free Function - A named expression with parameters and return value
Method/Member Function -
Lambda/Anonymous Function - An anonymoyus function
Closure - A lambda with environment variable captures
Thunk - A call that does not return to the caller directly

Action - A Delegate with no parameters or return value
Delegate
Callable
Runnable

Task
Thread
Process
Job
Interrupt

## Process

A Process is a program instance with its own unique address space and resources.

## Closure

A function closed over a set of variables. Methods are closures over their class instance.

## Lambda

Anonymous function

## Procedure

Procedures are functions that produce side effects instead of returning a value.

## Subroutines

Subroutines are synchronous code that do not yield to another code.

## Interrupts

Interrupts are special execution contexts which have no arguments and no return
values. They are may be executed at any time regardless of the program execution
state. Interrupts are used to perfrom context switches and service real time
hardware events. They are necessarily restricted in their execution time in order
to not adversely affect the real time responsiveness of the system as a whole.
They also cannot perform blocking operations or communicate with shared resources.
Even using Mutex objects and other synchronization primitives is not allowed,
since an interrupt may have occured during an operation on shared resources or
the synchronization primitives themselves.

## Threads

Threads are preemptive multitasking contexts. They provide concurrent and
parallel execution, but require synchronization in order to share resources.

The thread API defines an interface for managing the execution state of each
thread and provides a method of signaling events. Shared resources are required
for more sophisticated inter-thread communication.

Threads are not supported at the language level. They are implemented as modules
and tied to a system architecture.

## Tasks

Tasks are light wieght threads that are run in the background, whose purpose is
to perform some long running operation without blocking the calling thread.
Tasks are threads.

Tasks may suspend from within other tasks but not from within functions.

Tasks are state machines and the thread manages all tasks abnd blocks at the main
task runner context.

Async I/O is managed within a coroutine context on a thread and the thread will
still block unless it has other work to do in parallel given by the programmer.

This is a design flaw which offloads more, non-obvious responsibilities to the
programmer and makes calling tasks more tedious.

If everything is a task, we loose the stack and heap memory becomes a bottle-
neck.

If we use stackful coroutines, we need more stack space.

1. Make coroutines independant of their thread
2. Make async and normal functions transparent
3. Reduce stack space and heap fragmentation
4. Using explicit yield points for coroutine switching
5. Use non-recursive stacks for exact context heap allocation
6. Use resursive calls as linked lists
7. Manage many to many blocking dependencies
8. Use scheduling to avoid starvation
9. Don't block threads
10. Make blocking okay by fast switching to other tasks
11. Threads are perfect except for context switching overhead, stack size, and data races
12. Coroutines solve all 3 of those issues, but use heap and loose preemption (compiler generated yields?)
13. Coroutines use linked list to deal with recursion or full stack is known worst case
14. 

Use stack pointer to switch context.
Cooperative scheduling removes the need for storing register state.
Cooperative scheduling breaks down when coroutines do not cooperate (yield).
Switch at function calls (custom calling convention)? Compiler inserts yields? Avoid large loops?

## Coroutines

Coroutines are cooperative multitasking contexts. They provide concurrent
execution without synchronization, but are not parallel.

The corouting API defines an interface for switching execution between
coroutines. Signaling is not required, though sequence points are well defined,
they are not exposed. SHared resources are required for more sophisticated
communication.

Coroutines must be supported at the language level. The syntax for coroutines
is smilar to that of functions, but the yield keyword is used to define a sequence
point. Yield may return a signaling value. Fail is used to indicate the coroutine
execution state of running or stopped.

## Iterators

Iterators are statefull models of iteration of an iterable object.

They maintain the state of the iteration.

## Generators

Generators are coroutines which yield values of an iterable until the iteration is complete.

## Implementation

Coroutines are implemented just like objects.

Coroutines store all stack variables as members of the coroutine type.
The stack variables before the final return do not have to be stored, because they
will never be reused.

Calling the coroutine will return the coroutine object just like a thread handle.

Calling the process method on the coroutine object will resume execution from the
previous location.

The coroutine definition is divided into methods wherever there is a yield statement.

The method pointer is used to resume execution.

Or one method with a switch statement...

## Type

### Properties

### Methods

- `next()` - Block until the next value is returned
- `send()` - Send a value to the coroutine
- `process()` - Run the coroutine without blocking the calling thread.
- `is_done()` - Returns true if the coroutine has finished

## Generator Example

```mj
u64 fibonacci(u32 n) {
    if (n == 0) {
        return;
    }

    if (n > 94) {
        error("Too big Fibonacci sequence. Elements would overflow.");
        fail;
    }

    yield 0;

    if (n == 1) {
        return;
    }

    yield 1;

    if (n == 2) {
        return;
    }

    u64 a = 0;
    u64 b = 1;

    for (u32 i = 2; i < n; i++) {
        u64 s = a + b;
        yield s;
        a = b;
        b = s;
    }
}
```

```c
struct fibonacci_t {
    void (*next)(fibonacci_t *, u64 *);
    u64 a; // There is no stack overlap and no variables after the final yield, so every variable is a member
    u64 b;
    u64 s;
    u32 n;
    u32 i;
};

void fibonacci_init(fibonacci_t *this, u32 n) {
    this->next = fibonacci_0;
    this->n = n;
    this->a = 0;
    this->b = 1;
    this->i = 2;
}

void fibonacci_next(fibonacci_t *this, u64 *result) {
    this->next(this, result);
}

bool fibonacci_is_done(fibonacci_t *this) {
    return !this->next;
}

void fibonacci_next0(fibonacci_t *this, u64 *result) {
    if (this->n == 0) {
        this->next = NULL;
        return;
    }

    if (this->n > 94) {
        error("Too big Fibonacci sequence. Elements would overflow.");
        this->next = NULL;
        return;
    }

    this->next = fibonacci_next1;
    *result = 0;
}

void fibonacci_next1(fibonacci_t *this, u64 *result) {
    if (this->n == 1) {
        this->next = NULL;
        return;
    }

    this->next = fibonacci_next2;
    *result = 1;
}

void fibonacci_next2(fibonacci_t *this, u64 *result) {
    if (this->n == 2 || this->i >= this->n) {
        this->next = NULL;
        return;
    }

    this->s = this->a + this->b;
    this->next = fibonacci_next3;
    *result = this->s;
}

void fibonacci_next3(fibonacci_t *this, u64 *result) {
    this->a = this->b;
    this->b = this->s;
    this->i++;

    if (this->i >= this->n) {
        this->next = NULL;
        return;
    }

    this->s = this->a + this->b;
    *result = this->s;
}
```

## Designs

Global vs local coroutines. Singleton or object?

### Coroutine

The coroutine does not accept arguments and returns void.

Coroutines are similar to threads, they do not return a value.

```mj
Coroutine subtask() {
    yield task; // Transfer execution to the main task.
}

Coroutine task() {
    until (is_done()) {
        yield subtask; // Transfer execution to the subtask.
        Coroutine &job;
        yield job; // Transfer execution to another coroutine.
        yield; // Transfer execution back to the caller.
    }
}
```

### Generator

The coroutine yields a value at every yield.
Generators are a subset of coroutines that only yield back to the caller and return a value each time.
Generators always yield back to the caller. They cannot yield to another coroutine explicitly.

```mj
u32 range(u32 n) {
    for (u32 i = 0; i < n; i++) {
        yield i;
    }
}

Generator<u32> range(u32 n) {
    for (u32 i = 0; i < n; i++) {
        yield i;
    }
}
```

### Consumer

The coroutine expects an argument at every yield. and performs iterative processing of the values.

```mj
void send(String &message) {
    for (u32 i = 0; i < n; i++) {
        tcp.send(yield);
    }
}
```

### Input/Output (Consumer/Producer)

The coroutine expects an argument and yields a value at every yield.

```mj
u32 range(u32 n) {
    for (u32 i = 0; i < n; i++) {
        i = yield i;
    }
}
```

## Coroutine Runner

A coroutine runner is a task which iteratively executes void-void coroutines until they have all returned.

To suspend execution

To improve concurrency

## Symetric Coroutines

When coroutines yield to eachother, they are not calling liek normal functions. There is no stack growth.
