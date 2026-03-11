# Deployment Package

A deployment package is an architecture-specific build artifact produced from a binary archive for a specific target. It contains the compiled shared object binary, the deployment descriptor, and optionally the debug information for that build. It is distinct from the binary archive, which is architecture-independent and contains no compiled code.

The deployment package and the binary archive it was built from are complementary artifacts. The archive is the canonical distribution unit for source-level consumption — compilation, tooling, and IDE support. The deployment package is the distribution unit for runtime deployment — linking, execution, and debugging.

---

## Components

### Shared Object Binary

The compiled binary for the target architecture. Contains pre-compiled implementations of all non-generic public functions and any generic specializations the module produced during its own compilation. The shared object is a static linking artifact — all consumers link against it at build time and resolve all symbols statically. There is no runtime dependency mechanism and no dynamic loading.

Pre-compiled specializations in the shared object are available to consumers as call-by-address targets. Specializations not present in the shared object are generated locally by the consuming compiler from the scanned source in the archive and included in the consumer's binary. The consumer never depends on a specialization being present at runtime that was not verified at link time.

### Deployment Descriptor

A metadata file describing the contents of the shared object and the target it was compiled for. The descriptor is the bridge between the architecture-independent archive and the architecture-specific shared object, allowing the toolchain to match call sites against available pre-compiled symbols without inspecting the binary directly.

**Target declaration.** The target architecture, ABI, and platform constraints the shared object was compiled for. The toolchain uses this to verify compatibility before linking.

**Symbol table.** The complete set of symbols provided by the shared object — functions, concrete specializations, and non-generic implementations — each with its stable address or address resolution record. Symbols are identified by their fully qualified names and specialization keys so the compiler can match them unambiguously against required call sites.

**Pre-generated specialization index.** For each generic function and type in the module, the set of concrete type arguments for which a pre-compiled specialization exists in the shared object. The compiler consults this index when a call site requires a specialization — if the index contains a matching entry, the pre-compiled address is used. If not, the compiler generates the specialization locally from the archive's scanned source.

**Inline code declarations.** Functions the module exposes as inline, available for the compiler to substitute at call sites rather than calling the shared object address. Inline declarations are backed by the function body in the archive's scanned source section. The compiler may choose to inline or call the address depending on optimization settings and call site context.

**ABI declarations.** Calling conventions, stack layout expectations, and register usage for each exported symbol. Required for correct code generation at call sites that use the pre-compiled address.

### Debug Information

Source location mappings, symbol names, and type information for debugger integration. Debug information is architecture-specific and build-specific — it contains address mappings that are only meaningful for the exact binary it was produced alongside.

**Source location mappings.** A mapping from binary addresses to source file locations — file, line, and column. Enables the debugger to display the current source location during execution and set breakpoints by source position.

**Symbol table.** Human-readable names for all functions, types, and variables, mapped to their binary addresses. Includes mangled and demangled forms for readable stack traces and breakpoint-by-name support.

**Type information.** Full type descriptions including field names, offsets, sizes, and pointer representations. Enables the debugger to display structured variable values with accurate field names rather than raw memory.

**Inline expansion records.** For monomorphized generic specializations, a record of the original generic definition and the type arguments used, so the debugger can display specializations in terms of the source-level generic rather than the mangled concrete name.

**Vtable symbol mappings.** Mappings from vtable addresses to the interface and concrete type they represent, enabling the debugger to display the concrete type behind an abstract reference and navigate to the correct method implementation during dynamic dispatch.

---

## Build Configuration

Debug information is included in the deployment package by default for debug builds. Release builds strip debug information from the primary deployment package, producing a smaller artifact with no symbol exposure.

A **symbols package** may be produced alongside a stripped release deployment package, containing only the debug information component. Debuggers and crash reporters can load the symbols package alongside the stripped deployment package to restore full debug capability without distributing symbols in the primary artifact. This is the standard model for production debugging and crash reporting.

---

## Relationship to the Binary Archive

The deployment package references the archive it was built from by a stable identifier. The toolchain uses this reference to:

- Locate the scanned source for generating specializations not present in the shared object
- Validate that the deployment descriptor's symbol table is consistent with the archive's type metadata
- Associate debug information with the correct source locations in the archive

A deployment package without its corresponding archive can still be linked against — the symbol table and ABI declarations are sufficient for call-by-address linking — but local specialization generation is unavailable and cross-boundary optimization is limited to what the deployment descriptor declares rather than what the full scanned source enables.

---

## Compiler Behavior at Link Time

At each call site involving a symbol from a deployment package, the compiler evaluates three options in order of preference as configured by optimization settings:

**Inline.** If the function is declared inline in the deployment descriptor and the call site benefits from inlining, the compiler substitutes the function body from the archive's scanned source directly. No call instruction is emitted. Full optimization across the boundary.

**Call pre-compiled address.** If a matching pre-compiled specialization exists in the shared object, the compiler emits a call to the stable address from the deployment descriptor. No local code generation for that specialization.

**Generate locally.** If no pre-compiled specialization exists for the required type arguments, the compiler generates the specialization from the archive's scanned source and includes it in the consumer's binary.

These decisions are made independently per call site and per specialization. Because the full scanned source is always available from the archive, the compiler retains complete cross-boundary optimization visibility regardless of which path is taken.
