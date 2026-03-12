# Partial Dynamic Specialization (PDS)

## Overview

Partial Dynamic Specialization (PDS) is a design pattern for templated classes in which one or more **internal template parameters** affect only a subset of methods in the class. PDS allows these methods to be **dynamically dispatched via an implicit interface and vtable**, while keeping the rest of the class **fully concrete and statically dispatched**.

This approach is particularly suited for **containers** where internal variations, such as allocators, growth policies, or internal synchronization strategies, should be flexible without compromising the public API’s performance or type safety.

---

## Motivation

In templated containers, certain template parameters:

* Are **purely internal** (e.g., an allocator).
* Do **not affect the public API** (e.g., iteration, indexing, size).
* Would traditionally require either:

  * **Full template specialization**, generating multiple concrete instantiations.
  * **Interfaces or type erasure**, which could impact all methods unnecessarily.

PDS provides a compromise:

* **Dynamic dispatch is limited** to methods depending on the template parameter.
* **Static dispatch remains** for all other methods.
* No explicit interface is required; the compiler generates an **implicit internal interface** and a **restricted vtable**.

---

## Key Concepts

| Concept                         | Description                                                                                                       |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Internal template parameter** | A type parameter that only affects a subset of internal methods.                                                  |
| **Implicit interface**          | Automatically generated interface containing only methods that depend on the internal template parameter.         |
| **Restricted vtable**           | Contains pointers only to the methods in the implicit interface, minimizing dynamic dispatch overhead.            |
| **Concrete container type**     | The container itself remains a single concrete type for all operations, except internal template-dependent calls. |

---

## Behavior

### 1. Static vs Dynamic Dispatch

* **Static methods**:

  * All public API operations unrelated to the internal parameter are fully inlineable and statically dispatched.
  * Example: `Array<T, A>.push()`, `Array<T, A>.pop()`, `Array<T, A>.len()`.

* **Dynamic methods**:

  * Internal operations that depend on the template parameter are dispatched through a **restricted vtable**.
  * Example: `Array<T, A>.allocate()`, `Array<T, A>.deallocate()`, `Array<T, A>.grow()` (for an allocator template parameter `A`).

### 2. Type Safety

* The container remains a fully concrete type.
* Dynamic dispatch is **internal only**, so the public API does not lose type safety.

### 3. Compiler Optimizations

* Because the implicit interface is **restricted and closed**, the compiler can often **devirtualize calls** when the concrete type is visible.
* Static methods remain **fully inlineable**, preserving performance.

---

## Syntax Example

```mj
// Templated container with an allocator
Array<T, A>

// Static allocator usage
Array<i32, GlobalAllocator> a1 = Array();
// Fully static, all calls inlined

// Partial dynamic specialization
Array<i32, Any> a2 = Array();
// Any triggers internal PDS:
// - allocator-dependent methods go through a restricted vtable
// - public API remains fully concrete
```

**Internal representation of `Array<T, Any>`:**

* Concrete data fields: element storage, length, capacity.
* Allocator field: reference to the concrete allocator instance.
* Restricted vtable: contains only allocator-dependent methods (`allocate`, `deallocate`, `grow`).
* Public methods (`push`, `pop`, `iter`, `len`) remain **concrete**.

---

## Use Cases

* **Internal allocators**: dynamic selection of memory allocation strategies.
* **Growth strategies**: different resizing policies for containers.
* **Internal synchronization**: runtime selection of locking or lock-free strategies.
* **Instrumentation or logging**: selectively enable profiling on certain methods.

**Important constraint:** PDS should be applied **only to template parameters that are purely internal**. Using PDS on parameters that affect the public API can compromise type safety and performance.

---

## Advantages

* Reduces **code duplication** for template-heavy containers.
* Keeps **public API fully static and safe**.
* Confines **dynamic dispatch to a minimal, well-scoped subset of methods**.
* Enables compiler optimizations and devirtualization due to **closed set of implementations**.
* Requires **no explicit interface declaration** from the programmer.

---

## Diagram

```text
Array<T, A>
├── Data Fields (ptr, len, cap)
├── Allocator Reference (A)
├── Public API (static)
│    ├── data()
│    ├── size()
│    ├── iter()
│    ├── search()
│    └── remove()
└── Internal Methods (dynamic via restricted vtable)
     ├── resize()
     ├── append()
     └── insert()
```

---

## Summary

Partial Dynamic Specialization is a **container-specific design pattern** for handling internal template parameter variations:

* **Static dispatch** for everything unrelated to the internal parameter.
* **Dynamic dispatch via a restricted vtable** for parameter-dependent methods.
* **Implicit internal interface** eliminates the need for manual interface definitions.
* Preserves performance, type safety, and API simplicity while allowing runtime flexibility.

It is particularly well-suited for **allocators and other internal policies in containers**, and is not intended for template parameters exposed in the public API.
