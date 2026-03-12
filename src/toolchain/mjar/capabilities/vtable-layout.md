# Archive Section: Vtable Layout

## Overview

The vtable layout section contains pre-computed flat vtable records, interface section offsets, and inline vtable sizes for all types in the archive. It is an optional section.

---

## Purpose

Without this section the consuming compiler recomputes vtable layouts from the interface and type metadata. With it, vtable layouts are consumed directly, saving computation and enabling the IDE to display accurate vtable information for library types without a full compilation pass.

---

## Contents

**Flat vtable records.** The complete flat vtable layout for each concrete type in the module, with all method entries from the full interface hierarchy laid out in a single record. Each entry includes the method identifier, its offset within the record, and its signature.

**Interface section offsets.** For each interface implemented by each type, the byte offset of that interface's section within the flat vtable record. Consumers use these offsets to locate the correct section when dispatching through a specific interface without scanning the record.

**Inline vtable metadata.** For interfaces that declare the inline vtable constraint, the offset of the vtable pointer within the instance record and the size of the inline vtable storage. Consumers use this to generate correct thin pointer references and instance record layouts for implementing types.

**Orthogonal interface entries.** For types participating in orthogonal interface combinations, the vtable pointer array layout and the canonical ordinal assignments for each orthogonal interface.

---

## Consumer Behavior

A consumer with this section uses the pre-computed layouts directly rather than recomputing them from interface definitions. This is particularly valuable for large interface hierarchies where flat layout computation is expensive.

The IDE uses the section to display vtable layout diagrams and dispatch overhead estimates for library types inline in the editor, without requiring a compilation pass against the module.

When absent, the consumer recomputes all vtable layouts from the interface and type metadata section. The result is identical — the vtable layout section is a cached computation, not authoritative data.
