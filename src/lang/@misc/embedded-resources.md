# Embedded Resources

A method of including external resources at compilation time. Resources can be registered at the
module scope and bound to a typed resource constant.

```mj
@embed("profiles.csv")
CsvFile profiles
```
