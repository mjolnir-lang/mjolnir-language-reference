# Threads

Threads are sequential execution contexts associated with a unique call stack.

## Structure

Threads are defined as functions with a special call signature.

## The Main Thread

The main thread identifies the single point of execution and cannot be killed while child threads are running.

It has a general set of call signatures:

Bare metal:

```mj
void startup() {

    // Bare metal environment setup code...

    main();
}


void main();
```

Operating systems:

```mj
u32 main(const String *args[]);
```

## Process Threads

Process threads

```mj
void thread_1() {
    ...
}


void thread_2(u32 n, const String &message) {
    ...
}


Thread thread = Thread(
    () => {
        print("stuff");
    },
    1024
);
```
