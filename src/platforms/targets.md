# Targets

## Annotations

## Target Features

## Target Types

There are several types of platform targets: operating systems, microcontrollers, CPUs, or architectures.

For SIMD or vectorized instructions, these are usually implemented as architecture extensions and
architecture features are not always available.

When compiling a multi-target binary, some level of run-time dispatch is required to properly select
the appropriate code for the host platform.

We have the following problem:

## Problem

Mjolnir aims to be a platform agnostic language, library, and tool suite, but there are many platform
and vendor specific features

Annotate functions with `@target()` and `@target-feature()` to define explicit code duplication points.

Unannotated functions which call annotated functions will be left to the compiler to decide to duplicate or
switch on the call site.

When performing a run-time dispatch for target specific code, the program should determine the target
and target features once and then use that result for efficient switching.

The most performant target feature should be inlined and the less performant features should be
executed by dispatch.

Target annotated functions can only be inlined within other target annotated functions.
