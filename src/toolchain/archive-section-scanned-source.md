# Archive Section: Scanned Source

## Overview

The scanned source section contains the compiler's internal representation of the module after parsing and name resolution. It is a required section present in every valid archive.

---

## Purpose

Consuming compilers skip re-parsing and re-scanning entirely when this section is present. Type checking, specialization, and code generation proceed directly from the scanned form. This is the primary compilation speed benefit of the archive format — the most expensive early compiler passes are paid once by the producer and amortized across all consumers.

---

## Contents

The scanned source encodes the full abstract syntax after name resolution. All identifier references are resolved to their definition sites. Scope information is preserved. The representation is self-contained — no source files are required to consume it.

The scanned form is the compiler's canonical intermediate representation and is not intended to be human readable. It is specific to the compiler version that produced it. Archives include a compiler version identifier in the section manifest so consumers can detect and handle version mismatches.

---

## Consumer Behavior

A consumer that can interpret the scanned source section proceeds directly to type checking and specialization without invoking the parser or scanner. A consumer that cannot interpret the section — due to a version mismatch or an unsupported format — falls back to requiring raw source files if available, or rejects the archive if source is not present.

---

## Relationship to Other Sections

The interface and type metadata section is derived from the scanned source but encodes only the public API surface. Consumers that only need to check constraints and resolve dispatch may use the metadata section alone without processing the full scanned source. The scanned source is needed when the consumer needs to generate new specializations or perform full type checking against the module's internals.
