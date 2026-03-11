# For-Loop Statement

A for loop statement 

## Syntax

### Basic `for-loop`

```mj
for (u32 i = 0; i < size; ++i) {
    ...
}

for (u32 i is range(0, 74)) {

}
```

Equivalent

```mj
u32 i = 0
while (i < 7) {
    i += 1
}
```

### Ranged-based `for-loop`

```mj
for (u32 v is 0:7) {
    ...
}
```

Equivalent

```mj
Iterator<u32> it = 0:7

while (it.has_next()) {
    u32 v = it.next()
    ...
}
```

Equivalent

```mj
Iterator<u32> it = 0:7

do {
    u32 v = try (it.next()) {
        break
    }

    ...
}
```

Equivalent

```mj
Iterator<u32> it = 0:7

while try (u32 v = it.next(v)) {
    ...
}
```
