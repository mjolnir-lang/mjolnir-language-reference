# Comments

Comments are non-code sections that provide inline documentation and notes for explaining source
code. They are ignored by the compiler but parsed by language servers and documentation tools to
provide meaningful information for symbols.

There are two forms: line comments and block comments. Both support text markup and inline code
highlighting, and both can reference types and identifiers. Block comments additionally support
multi-line code blocks.

Block comments use three forward slashes (`///`). When followed by text, a space is required after
the slashes, making the prefix four characters wide — consistent with the language's tab width. This
alignment aids formatting of code blocks and nested lists.

While comments are important for documentation and design rationale, they should not duplicate
information already clear from the code. Comments should explain *why* code exists or is structured
a certain way, not *what* it does when that is self-evident. If a block of code requires a comment
to explain a high-level operation, that may be a signal to extract it into a named function. If the
purpose of a section is not clear, a comment should provide context.

Commenting out code is useful during development and debugging but can become a code smell when the
reason is unclear or forgotten.

## Line Comments

Line comments begin with `//` and consume all characters until the end of the line.

```mj
n32 random_number() {
    // chosen by fair dice roll.
    // guaranteed to be random.
    return 4
}
```

## Block Comments

Also called doc comments.

Block comments begin with `///` and are used for structured documentation. When placed before a type
or function definition, variable declaration, or member, they are bound to that element as its
documentation.

```mj
/// # Example
///
/// ```
/// for (u32 i : numbers) {
///     Process::output_stream.print("{}\n", i)
/// }
/// ```
```

## Comment Markup

Comments have built-in support for textual markup. The markup is intended to be readable directly in
the source and not to introduce complicated syntax for documentation tooling — all formatting is for
the developer reading the code.

### Tags

Both line and block comments may contain tags that provide structured context:

```mj
// BUG: This is a bug.
// DEPRECATED: This is deprecated.
// FIXME: This needs to be fixed.
// HACK: This is a workaround.
// NOTE: This is important.
// OPTIMIZE: This needs to be optimized.
// REVIEW: This needs to be reviewed.
// TODO: This needs to be implemented.
```

### Inline Code

Both comment forms support inline code with backticks. Only Mjolnir code is supported; language
servers will apply correct syntax highlighting. Note that string literals and raw strings may
consume backtick or quote characters, so they must be well-formed within the inline span or the
comment is ill-formed:

```mj
// Well-formed: `numbers.len()`
// Well-formed: `"a string literal"`
// Well-formed: `'a raw string literal'`
// Ill-formed: `'a raw string literal`, It's missing the closing quote character.
```

### Headings

Block comments support section headings with hierarchy denoted by the number of `#` characters:

```mj
/// # Heading 1
/// ## Heading 2
/// ### Heading 3
```

### Code Blocks

Block comments support multi-line code blocks. Language servers will apply syntax highlighting:

```mj
/// Return the average value of a collection of scalar objects.
///
/// `set` - The collection of elements.
T average<type T>(Iterable<T>& set)
```

### Lists

Block comments support ordered and unordered lists:

```mj
/// 1) Step 1
/// 2. Step 2
///     - Names
///     - Stuff
```
