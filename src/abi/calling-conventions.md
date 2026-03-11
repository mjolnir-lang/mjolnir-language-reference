# Calling Convention

Mjolnir's calling convention is designed around three principles: semantic parameters occupy the hottest registers, error handling is zero-cost on success paths, and dispatch table entries are uniform across fallible and non-fallible functions without sacrificing calling efficiency.

---

## Parameter Ordering

Parameters are ordered by temporal access pattern — values consumed at the start of execution come first, values written at the end come last.

For methods the full parameter order is:

1. **Instance pointer** — the dispatch subject, always first
2. **Semantic parameters** — the actual inputs to the function
3. **Error out pointer** — destination for the error code

The return value uses natural return semantics. Scalar values are returned in the return register. Larger values follow the platform ABI's struct return convention. The C compiler handles all return value optimization automatically.

For free functions the instance pointer is omitted. The ordering of the remaining parameters is unchanged.

Methods and functions are type equivalent. A method is a function whose first parameter is the instance pointer. There is no separate method pointer concept — a dispatch table entry is a plain function pointer whose first parameter happens to be the instance type.

---

## Error Handling

The error out pointer is the trailing parameter and may be omitted entirely. Omitting it does not disturb the ordering of any other parameter. This produces a natural three-tier calling convention:

| Tier | Parameters | Usage |
|------|-----------|-------|
| Full | instance, params, error out | Fallible call, error checked |
| Bare | instance, params | Non-fallible or error discarded |

Each tier is a strict suffix truncation of the previous. No reordering occurs. A dispatch table entry for a fallible function is callable under either tier — the callee simply does not receive the pointer it was not passed.

### Error Slot Ownership

The caller owns the error slot. Before any call through a fallible function pointer, the caller clears the error slot to the success value. The callee writes the slot only on failure. On success the slot retains the pre-cleared value and is never touched by the callee.

The invariant is:

- Caller clears before indirect calls through fallible function pointers
- Callee writes only on failure
- Caller reads after the call if it cares
- Static calls to known non-fallible functions pay nothing — the compiler eliminates both the preclear and the post-call check as dead work

---

## Result Type Composition

The return value and error out pointer together form a pre-decomposed result type. The callee returns its value naturally and writes the error slot only on failure. The caller decides what those outputs mean structurally:

**Composing a result struct.** Aim the error out pointer at the error field of a result struct and assign the return value to the value field at the call site. No copying occurs and no intermediate value is constructed.

**Zero-overhead error propagation.** Assign the return value to its destination and branch on the error slot. No struct is involved.

**Assume success.** Point the error out pointer at a static discard slot. The caller never reads it. The branch is eliminated.

**Error propagation up the stack.** Pass the caller's own error out pointer directly to the callee. The error slot is shared across the entire call chain and examined only at the boundary where the caller actually handles it.

The result and option types in the language are not special forms. They are structs whose field layout matches the natural output of a function call. Constructing one from a call is free.

---

## Coroutine Frames

Each coroutine frame is a heap-allocated struct capturing the coroutine's resumption point and local variables. The error out pointer for a coroutine's current operation is a field in that struct. When the coroutine yields, error state is preserved as part of the frame with no special handling. When it resumes, the error slot is where it was left.

No thread-local or global error state is required. Error state is coroutine-local by construction.

---

## Dispatch Table Uniformity

All dispatch table entries share the same calling convention shape regardless of whether the underlying function is fallible. The trailing error pointer position is fixed. A non-fallible function called through a fallible function pointer receives an error out pointer it never writes — the caller pre-cleared it and reads back the success value it initialized.

Dispatch table entries require no wrappers, no trampolines, and no special cases for fallibility. The table is a flat array of function pointers. Promoting a non-fallible function to a fallible call site costs exactly one store to clear the error slot before the call.

---

## Register Pressure

The error out pointer is placed last because it has a different access pattern from all other parameters — it is written only at exit and only on failure, while semantic parameters are consumed throughout execution. Placing it last ensures the compiler never needs to sacrifice an early argument register to service the error channel.

On platforms with sufficient argument registers the error pointer occupies a late register and is never loaded except on the failure path. On platforms where it spills to the stack it is the first parameter to spill and the last to be accessed, which is the correct spill priority given how rarely it is touched.

A function that processes a long sequence of trivial operations loads its semantic inputs once at entry, works entirely in registers, and writes the error slot once on failure or not at all on success. The calling convention machinery is invisible during execution on the success path.

---

## Parameter Ordering

Parameters are ordered by temporal access pattern — values consumed at the start of execution come first, values written at the end come last.

For methods the full parameter order is:

1. **Instance pointer** — the dispatch subject, always first
2. **Semantic parameters** — the actual inputs to the function
3. **Value out pointer** — destination for the return value
4. **Error out pointer** — destination for the error code

The instance pointer and semantic parameters occupy the first argument registers. They are loaded at function entry and live throughout execution. The out pointers are trailing — written only at exit points, pushed to the end of the register file or spilled to the stack. A function that processes a long sequence of operations never loads its out pointers until the very end, keeping its working registers uninterrupted throughout.

For free functions the instance pointer is omitted. The ordering of the remaining parameters is unchanged.

---

## Out Pointer Convention

Every return value is written through a caller-provided out pointer rather than returned in a register. This applies uniformly to all functions — fallible and non-fallible alike — ensuring that function pointer types are uniform and dispatch table entries are interchangeable.

The cost of the out pointer is equivalent to passing a return address — one additional pointer-sized parameter. On platforms with spare argument registers the out pointers occupy those registers and have no stack overhead. On platforms where they spill to the stack, they spill last and are accessed least, which is the correct behavior given their cold access pattern.

The callee writes through the out pointers only at return sites. The hot path through a function body never touches them.

---

## Error Handling

The error out pointer is the trailing parameter and may be omitted entirely. Omitting it does not disturb the ordering of any other parameter. This produces a natural three-tier calling convention:

| Tier | Parameters | Usage |
| ---- | ---------- | ----- |
| Full | instance, params, value out, error out | Fallible call, error checked |
| Value only | instance, params, value out | Fallible call, assume success |
| Bare | instance, params | Non-fallible or both outputs discarded |

Each tier is a strict suffix truncation of the previous. No reordering occurs. A dispatch table entry for a fallible function is callable under any tier — the callee simply does not receive the pointer it was not passed.

### Error Slot Ownership

The caller owns the error slot. Before any call through a fallible function pointer, the caller clears the error slot to the success value. The callee writes the slot only on failure. On success the slot retains the pre-cleared value and is never touched by the callee.

The preclear cost is a single store to a known address immediately before an indirect call. This is negligible against the dispatch overhead already present at that site. For statically resolved calls to known non-fallible functions the compiler proves the error slot is never written and eliminates both the preclear and the post-call check as dead work.

The invariant is therefore:

- Caller clears before indirect calls
- Callee writes only on failure
- Caller reads after the call if it cares
- Static calls to non-fallible functions pay nothing

---

## Result Type Decomposition

The value out pointer and error out pointer together form a pre-decomposed result type. The callee writes two independent slots with no opinion about their structural relationship. The caller decides what those slots mean:

**Composing a result struct in place.** Point both out pointers into fields of a result struct. The callee writes directly into the struct fields. No copying occurs and no intermediate value is constructed.

**Zero-overhead error propagation.** Point the value out pointer at a live destination and the error out pointer at a control flow check site. The callee writes both. The caller branches on the error value. No struct is involved.

**Assume success.** Point the error out pointer at a static discard slot shared across all ignored error sites. The callee writes success into the discard slot. The caller never reads it. The branch is eliminated.

**Error propagation up the stack.** Pass the caller's own error out pointer directly to the callee. The callee writes through it. The error slot is shared across the entire call chain and examined only at the boundary where the caller actually handles it.

The option and result types in the language are not special forms. They are structs whose field layout matches the natural output of a function call. Constructing one from a call is free because the callee writes directly into the struct's fields through the out pointers.

---

## Coroutine Frames

Each coroutine frame is a heap-allocated struct capturing the coroutine's resumption point and local variables. The error out pointer for a coroutine's current operation is a field in that struct. When the coroutine yields, error state is preserved as part of the frame with no special handling. When it resumes, the error slot is where it was left.

No thread-local or global error state is required. Error state is coroutine-local by construction, contained in the frame alongside all other coroutine-local values.

---

## Dispatch Table Uniformity

All dispatch table entries share the same calling convention shape regardless of whether the underlying function is fallible. The trailing out pointer positions are fixed. A non-fallible function called through a fallible function pointer receives an error out pointer it never writes — the caller pre-cleared it and reads back the success value it initialized.

This means dispatch table entries require no wrappers, no trampolines, and no special cases for fallibility. The table is a flat array of function pointers with a uniform signature. Promoting a non-fallible function to a fallible call site is always valid and costs exactly one store to clear the error slot before the call.

---

## Method and Function Equivalence

Methods and functions are type-equivalent. A method is a function whose first parameter is the instance type. There is no separate method pointer concept and no distinction in the type system between the two.

```mj
// These are the same type
bool Foo::bar(int)
bool bar(Foo&, int)

// have the same type
bool(Dog&, int)
```

This unification has several direct consequences.

**Dispatch table entries are plain function pointers.** Each entry is a pointer to a function whose first parameter is the instance type. A dispatch table lookup produces a function pointer and the call proceeds normally under the standard calling convention. No special method call machinery exists below the surface syntax level.

**Function pointers and method pointers are interchangeable.** A method can be passed anywhere a function pointer of the equivalent type is expected, and vice versa. Fallible and non-fallible functions remain interchangeable at dispatch boundaries under the truncation convention already described.

**Partial application is the natural binding mechanism.** Fixing the first parameter of a function to a specific instance produces a bound method. No separate closure, delegate, or binding construct is required. Bound methods are just partially applied functions.

**Dot syntax is surface sugar.** The expression `foo.bar(x)` and `bar(foo, x)` produce identical IR nodes. The dot syntax is desugared during parsing or early lowering and does not survive into the intermediate representation. This keeps the IR uniform — all calls are plain function calls with an explicit first argument — while preserving ergonomic source syntax.

**Free functions have no instance parameter.** The instance pointer being first is the convention for all functions. For free functions the instance parameter is simply absent, which is the same as saying the function type begins at the semantic parameters. No special case is required — a free function is just a method with no receiver.

---

## Register Pressure Summary

The design concentrates register pressure where it is unavoidable and eliminates it where it is not.

The instance pointer and semantic parameters occupy the first argument registers. These are always hot. The compiler never needs to spill them to service the calling convention.

The value out pointer and error out pointer are trailing. On platforms with sufficient argument registers they occupy the last registers and are loaded only at exit. On platforms where they spill, they are the first to spill and the last to be accessed, which is the correct spill priority.

A function that processes a long sequence of trivial operations loads its semantic inputs once, works entirely in registers, and writes its outputs once at the end. The calling convention machinery is invisible during execution.
