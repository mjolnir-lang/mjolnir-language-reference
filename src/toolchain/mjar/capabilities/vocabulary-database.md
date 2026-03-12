# Archive Section: Vocabulary Database

## Overview

The vocabulary database section contains the module's validated spelling records for identifier definition sites. It is an optional section that enables real-time spell checking and identifier vocabulary validation for the module and its consumers.

---

## Purpose

The vocabulary database is the authoritative record of which identifiers in the module have been validated as correctly spelled. It travels with the module in the archive so that consumers benefit from the producer's vocabulary work without rebuilding it. When present, real-time spell checking is always available — there is no explicit enable or disable switch.

---

## Contents

The database has two components:

**Scoped identifier entries.** References to specific definition sites within the module, recorded as validated vocabulary. Each entry identifies a definition by its location in the scanned source and records it as a known-good identifier. Validity is tied to the specific definition site — the same string at a different location in a different module is not automatically valid. This keeps the database auditable: a reviewer can inspect each entry and verify that the definition it references is intentionally spelled the way it is.

**Global vocabulary list.** A flat list of terms that are valid anywhere within the module — domain terminology, established abbreviations, and technical acronyms that appear throughout and would be tedious to register at every individual definition site. This list is module-scoped and does not propagate to consumers as part of their own vocabulary. It is global within the module, not across the ecosystem.

---

## Consumer Behavior

When this section is present in a dependency's archive, the consumer's spell checker gains access to the validated identifiers from that dependency. Identifiers defined in the dependency that appear as components in the consumer's own identifiers are recognized as valid vocabulary. This allows domain terminology to propagate naturally through the dependency graph without requiring each downstream module to re-register the same terms.

The consumer's own vocabulary database remains separate. Terms from a dependency's global vocabulary list do not automatically enter the consumer's global list — the consumer inherits recognition of specific validated identifiers, not the dependency's vocabulary policy.

When absent, the toolchain falls back to always-on identifier validation — checking that identifiers at use sites are defined in scope — without spell checking at definition sites.

---

## Relationship to Source

The vocabulary database lives as a separate file alongside the module source and is version controlled with it. It is never embedded in source files as annotations. The source stays clean and vocabulary management is an independently reviewable artifact. The archive bundles this file as the vocabulary database section at build time.
