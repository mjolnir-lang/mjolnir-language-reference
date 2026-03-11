# Archive Section: Specialization Profile

## Overview

The specialization profile section records specialization counts, code size contributions, and call site dispatch modes from the module's own compilation. It is an optional section that feeds into module scoring and IDE code insights.

---

## Purpose

The profile captures what the module's compiler actually produced — how many monomorphized specializations each generic function generated, how much code size each contributed, and what dispatch modes appeared at each call site. Consumers use this to understand the module's behavior under specialization before committing to a dependency, and to display accurate insights inline in the editor.

---

## Contents

**Per-generic specialization records.** For each generic function and type in the module's public API, the number of monomorphized specializations generated during the module's own compilation, the code size of each specialization in bytes, and the total duplication overhead relative to a hypothetical single dynamic implementation.

**Call site dispatch records.** For each call site in the module's public API surface, the dispatch mode — static or dynamic — and the concrete type argument if static. Enables the IDE to show typical dispatch patterns for library functions.

**Shorthand expansion records.** For each shorthand generic function, the number of implicit generic parameters introduced and the set of concrete specializations generated from them.

**Dynamic specialization records.** Call sites where abstract type arguments produced dynamic specialization rather than monomorphization, with the interface constraint satisfied at each site.

---

## Consumer Behavior

The toolchain uses the specialization profile to compute the module's generic duplication factor and caller-heavy index for module scoring. Consumers with this section get more accurate composition modeling estimates than those relying only on the type metadata.

The IDE displays specialization counts and dispatch mode information inline when a programmer calls a generic function or uses a generic type from the module. A function showing "12 specializations in library" gives the programmer immediate context about the likely cost of adding a new concrete type argument.

When absent, the toolchain derives coarser estimates from the type metadata alone. Module scoring and composition modeling remain available but with lower accuracy.
