# Flags

Flags use similar syntax to enums, but they are 1 hot encoded instead of binary encoded.

Some enumerations are used as flags, an multiple members may be encoded as single bits in the value.

```mj
flag<u32> Capabilities {
    [0] VERSION_1_0;
    [1] VERSION_1_5;
    [2] FEATURE_1;
    [3] FEATURE_2;
    [4] FEATURE_3;
}
```
