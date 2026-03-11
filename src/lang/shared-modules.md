# Shared Modules

Similar to shared libraries, shared modules are run-time linked compiled binaries.

## Module Linkage

### Static Linkage

### Dynamic Linkage

Semantic versioning is used to enforce shared module compatibility.

### ABI-Compatible Shared Modules

ABI compatibility requires that the application must be compiled against the version of the shared
module it can link with. Not all interfaces are purely virtual.

### API-Compatible Shared Modules

API compatibility requires that the application need not be compiled against the version of the
shared module it can link with. All shared interfaces are purely virtual.
