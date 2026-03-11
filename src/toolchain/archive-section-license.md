# Archive Section: License Information

## Overview

The license information section contains the license terms and attribution for the module. It is a required section present in every valid archive.

---

## Purpose

Bundling license information in the archive ensures that it travels with the module through every stage of distribution and consumption. Tooling surfaces license information automatically during dependency resolution and workspace scanning without requiring separate metadata files, manual tracking, or out-of-band documentation.

---

## Contents

**License declaration.** The license identifier for the module, using a standard identifier format where applicable. Custom or proprietary licenses include the full license text.

**Attribution.** Author and contributor information as declared by the module producer.

**Dependency license summary.** A summary of the license terms of the module's direct dependencies, allowing consumers to assess the license obligations of the full transitive dependency graph without inspecting each dependency individually.

**Notices.** Any required attribution notices, patent grants, or other legal text that must be preserved or displayed when the module is distributed or used.

---

## Consumer Behavior

The build system reads the license section during dependency resolution and surfaces any license terms that require consumer action — attribution requirements, copyleft obligations, or incompatibilities with the consumer's own license. License checks are performed automatically as part of the dependency graph evaluation rather than as a separate manual step.

The IDE surfaces the license of any module whose types or functions are in use at the current file, allowing programmers to assess license obligations without leaving their editor.

---

## Toolchain Enforcement

The toolchain can be configured with license policies that reject or warn on specific license types during dependency resolution. Policies are expressed as allowlists or denylists of license identifiers and are evaluated against the license section of each archive in the dependency graph. Violations are reported at dependency resolution time rather than at build time.
