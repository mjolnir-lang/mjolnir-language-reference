# Archive Section: Layout Statistics

## Overview

The layout statistics section contains record sizes, field offsets, fat versus thin pointer breakdowns, and fixed size annotation headroom for all public types in the module. It is an optional section.

---

## Purpose

Layout statistics allow the IDE and toolchain to display accurate memory layout information for library types without recomputing it from the type metadata. Programmers can see the memory footprint of any type they use from a dependency directly in the editor, informing decisions about storage, allocation, and layout compatibility.

---

## Contents

**Record sizes.** The total size in bytes of each public class and generic specialization that the module produced. For generic types, sizes are recorded per concrete specialization where known.

**Field offsets.** The byte offset of each field within each public record, including padding inserted for alignment. Enables the IDE to display accurate field layout diagrams.

**Pointer breakdowns.** For each abstract parameter position in each public generic type, whether the reference form is a fat pointer or a thin pointer, and the size of the fat pointer where applicable.

**Fixed size annotation headroom.** For each interface that declares a fixed size annotation, the declared size and the size of the largest known implementing type in the module. Consumers approaching the headroom limit can be warned before a compile error occurs.

**Alignment requirements.** The alignment requirement of each public type, for use in layout planning and interoperability with external code.

---

## Consumer Behavior

The IDE uses the layout statistics section to display record size, field layout, and pointer breakdown information inline at type definition and use sites. Programmers see the memory footprint of library types without leaving the editor.

The toolchain uses the section to validate abstract specialization compatibility coercions against library types — confirming that layout constraints are satisfied without recomputing layouts from scratch.

When absent, the toolchain recomputes layout statistics from the type metadata section. The result is equivalent but more expensive, and the IDE falls back to displaying computed rather than recorded sizes.
