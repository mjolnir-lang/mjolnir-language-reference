# Volatile

`volatile` is a CV qualifier.

## Examples

```mj

/// A device.
struct Device {

    /// Control Register
    @offset(0x00)
    bitfield<u32> {
        [0] ENABLE;
    } volatile CONTROL;

    /// Status Register
    @offset(0x04)
    const volatile StatusRegister STATUS;
    bitfield<u32> StatusRegister {
        [0] BUSY;
    }

    /// Status Register
    @offset(0x08)
    bitfield<u32> : volatile INT_EN {
        [0] I0_EN;
        [1] I1_EN;
        [2] I2_EN;
        [3] I3_EN;
    }
}

/// An instance of the device.
@address(0x1FFE0100)
Device DEVICE;

void main() {
    DEVICE.CONTROL.ENABLE = 1;

    while (DEVICE.STATUS.BUSY) {
        ...
    }
}
```
