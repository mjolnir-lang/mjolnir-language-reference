# Archive Section: Interface and Type Metadata

## Overview

The interface and type metadata section contains all public interfaces, classes, and generic definitions with their constraints, layout annotations, and abstract specialization compatibility declarations. It is a required section present in every valid archive.

---

## Purpose

The metadata section is the primary surface the consuming compiler uses to check constraints, resolve dispatch, and determine which specializations need to be generated. It encodes everything the compiler needs to work with the module's public API without processing the full scanned source.

The IDE uses this section to provide accurate type information, constraint checking, and dispatch mode inference for any call site involving the module's types, without a full compilation pass.

---

## Contents

**Interface definitions.** All public interfaces with their method signatures, generic parameters, layout constraints, inline vtable declarations, and parent interface relationships. Sufficient for the consuming compiler to construct the flat vtable layout for any concrete type implementing these interfaces.

**Class definitions.** All public classes with their field layouts, record sizes, vtable footprints, and implemented interfaces. Includes abstract specialization compatibility declarations for generic parameters where applicable.

**Generic definitions.** All public generic types and functions with their parameter declarations, constraints, and specialization compatibility properties. The consuming compiler uses these to validate generic arguments and determine which specializations to generate.

**Constraint declarations.** All `@where` clause constraints on public functions and methods, encoded in a form the compiler can evaluate against caller-provided argument types.

---

## Consumer Behavior

A consumer uses the metadata section to:

- Validate that generic arguments satisfy declared constraints
- Determine dispatch mode for call sites involving the module's types
- Resolve interface hierarchies and vtable layouts for implementing types
- Check abstract specialization compatibility before attempting coercion
- Generate specializations for generic functions and types defined in the module

The metadata section is sufficient for all of these tasks. The full scanned source is only needed when the consumer needs to generate new specializations that require access to the function body.
