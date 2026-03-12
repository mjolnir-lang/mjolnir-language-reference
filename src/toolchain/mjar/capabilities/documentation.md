# Archive Section: Documentation

## Overview

The documentation section contains pre-generated documentation for the module's public API, including interface hierarchy diagrams, specialization trees, and layout diagrams. It is an optional section.

---

## Purpose

Pre-generating documentation at archive production time means consumers never need to invoke the documentation generator for dependencies. The IDE can display rich, accurate documentation for any library type or function directly from the archive, with no build step required on the consumer's side.

---

## Contents

**API reference.** Generated documentation for all public interfaces, classes, generic types, and functions, derived from doc comments in the source and enriched with compiler-derived information about constraints, dispatch behavior, and layout properties.

**Interface hierarchy diagrams.** Visual representations of the interface inheritance structure, with vtable layout annotations showing which method entries appear at which offsets in the flat vtable record.

**Specialization trees.** For each generic type and function, a tree of the concrete and abstract argument combinations that the module itself used, annotated with specialization counts and code size contributions.

**Layout diagrams.** Per-type memory layout diagrams showing field positions, sizes, padding, and pointer representations. Includes vtable pointer positions for types with inline vtables.

**Cross-reference tables.** Tables linking abstract parameters to their abstract specialization compatibility status, coercion sites, and constructor cast sites within the module.

---

## Consumer Behavior

The IDE renders documentation section content inline at hover and navigation sites. Hierarchy diagrams, specialization trees, and layout diagrams are displayed in documentation panels without invoking the documentation generator or requiring source access.

When absent, the IDE generates documentation from the interface and type metadata section on demand. The result covers the API reference but omits the richer diagrams and cross-reference tables that require the full compilation record to produce accurately.
