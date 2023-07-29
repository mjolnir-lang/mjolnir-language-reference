# Comments

Comments are non-code sections that are ignorred by the compiler.

## General Comment

```mj
i32 get_random_number() {
    return 4; // chosen by fair dice roll.
              // guaranteed to be random.
}
```

## Documentation Comments

IDEs and external tools use.

### Variable Documentation

```mj
```

### Function/Method Documentation

```mj
// Return the average value of a collection of scalar objects.
//
// <- set
// -> 
T average<T>(Iterable<T> &set) {
    T average;

    for (T &t in set) {
        average += t;
    }

    return t / set.size();
}
```

### Class Documentation

```mj
// A Generic List
//
//
class List<T> {
    ...
}
```

### Enumeration Documentation

```mj
i32 get_random_number() {
    return 4; // chosen by fair dice roll.
              // guaranteed to be random.
}
```

### Variant Documentation

```mj
i32 get_random_number() {
    return 4; // chosen by fair dice roll.
              // guaranteed to be random.
}
```

### Structure Documentation

```mj
i32 get_random_number() {
    return 4; // chosen by fair dice roll.
              // guaranteed to be random.
}
```
