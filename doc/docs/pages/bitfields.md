# Bitfields

Bitfields are user defined types which represent memory accesses at the bit level.

## Bitfield Type Declaration

Bitfields are generally used for low level register access in platform drivers, and so while they may be named as any other type, it it common for bitfields to be declared as anonymous types.

```mj
bitfield<u32> {
    MASTER[0];
    SAMPLE[1];
    AUTOPCS[2];
    NOSTALL[3];
    PCSPOL[8:12];
    MATCFG[16:19];
    PINCFG[24:26];
    OUTCFG[26];
    PCSCFG[27];
} CFGR1;
```

Multiple Access

```mj
CFGR1.MASTER = 1;
CFGR1.SAMPLE = 0;
CFGR1.PINCFG = 7;
CFGR1.OUTCFG[1] = 1;
```

Single Access (others unchanged)

```mj
CFGR1 = {
    MASTER = 1;
    SAMPLE = 0;
    PINCFG = 7;
    OUTCFG[1] = 1;
};
```

## Memory

Bitfields are stored using the platform byte order.
