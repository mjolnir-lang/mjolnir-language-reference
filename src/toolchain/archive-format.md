# Binary Archive Format

Mjolnir distributes compiled libraries and modules as binary archives. An archive encodes the scanned source representation and bundled metadata in a compact binary format optimized for compiler and toolchain consumption. Archives are the canonical unit of distribution — a published library ships as an archive rather than raw source.

---

## Structure

An archive is composed of sections. Each section has a type identifier, a length, and a payload. Sections are listed in a **section manifest** at the start of the archive. Consumers read the manifest first to determine which sections are present and locate them without scanning the full archive.

### Required Sections

Every valid archive contains the following sections. An archive missing any required section is malformed and rejected by the toolchain.

- **Scanned Source** — the compiler's internal representation after parsing and name resolution
- **Interface and Type Metadata** — public type definitions, constraints, and layout declarations
- **License Information** — license terms and attribution for the module

### Optional Sections

Optional sections may be present or absent. A consumer that does not recognize a section type skips it safely. The absence of an optional section degrades gracefully — the toolchain falls back to a less informed but still correct result rather than failing.

- **Vtable Layout** — pre-computed flat vtable records and interface section offsets
- **Specialization Profile** — recorded specialization counts and dispatch modes from the module's own compilation
- **Layout Statistics** — record sizes, field offsets, and pointer breakdowns for public types
- **Documentation** — pre-generated documentation including diagrams and cross-reference tables
- **Vocabulary Database** — validated spelling records for identifier definition sites

---

## Workspace Scanning

Because archives encode pre-indexed dependency graphs, interface hierarchies, and generic parameter constraints, workspace scanning is a metadata operation rather than a parsing operation. The toolchain builds a complete picture of a workspace's type system, dispatch surface, and layout characteristics from archive metadata alone — without touching raw source files for any dependency. This keeps workspace scanning fast regardless of dependency tree size.

---

## Relationship to Deployment Packages

The binary archive is architecture-independent and contains no build-specific artifacts. Architecture-specific outputs — compiled shared object binaries, debug information, and linking metadata — are not part of the archive. They are distributed as a separate **deployment package** that references the archive it was built from. See the deployment package document for details.

---

## Extensibility

New section types may be defined as the language and toolchain evolve. A consumer that does not recognize a section type reads its length from the manifest and skips it safely. This allows new compiler features, profiling formats, and insight categories to be added to the archive format without breaking existing tooling.

Archive producers include a section manifest listing all present sections so consumers can determine capability without scanning the full archive payload.
