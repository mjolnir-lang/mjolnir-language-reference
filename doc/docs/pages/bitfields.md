# Bitfields

Bitfields are user defined types which represent memory accesses at the bit level.

## Bitfield Type Declaration

Bitfields are generally used for low level register access in platform drivers, and so while they may be named as any other type, it it common for bitfields to be declared as anonymous types.

```mj
volatile bitfield<u32> cfgr1 {
    [27] pcscfg
    [26] outcfg
    [25:24] pincfg
    [18:16] matcfg
    [11:8] pcspol
    [3] nostall
    [2] autopcs
    [1] sample
    [0] master
}
```

Multiple Access

```mj
cfgr1.master = 1
cfgr1.sample = 0
cfgr1.pincfg = 7
cfgr1.outcfg = 1
```

Single Access (others unchanged)

```mj
cfgr1 = {
    master = 1
    sample = 0
    pincfg = 7
    outcfg = 1
};
```

## Memory

Bitfields are stored using the platform byte order.
