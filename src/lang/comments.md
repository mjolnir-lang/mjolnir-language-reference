# Comments

Comments are non-code sections which provide inline documentation and notes for explaining the
source code. They are ignored by the compiler during compilation but will be parsed by language
servers and other documentation generation tools to provide meaningful information for symbols.

There are two forms of comments: line comments and block comments.

Comments may contain text markup and inline code highlighting and type or identifier references.

Block comments may contain multi-line code blocks.

Block comments are three forward slashes and if followed by any text, they should be followed by a
space. This makes the block comment 4 characters wide which is the same as the language tab width.
This alignment helps with formatting code blocks and nested lists.

```mj
/// # Example
///
/// ```
/// for (u32 i : numbers) {
///     Process::output_stream.print("{}\n", i)
/// }
/// ```
```

Line comments are also useful for temporarily hiding code from the program.

This is often referred to as "commenting out" code.

While useful for debugging and development, commented out code can be a code smell when the reason
for being commented out is not clear or is forgotten.

While comments are important for documentation and important notes concerning the source code itself,
comments should not duplicate information that can be gathered from the code itself and should not
be used for trivial matters. In general, comments should only be used where code requires an explanation
for its design rational, , or to provide context that cannot be cleaned from the surrounding code.

When a specific high level operation requires a comment, it might be an opportunity to move that
code to its own function.

When the purpose of a section of code is not clear, a comment should be added to provide context and
explain what the code does and why it is needed.

## Line Comments

Line comments begin with two forward slashes and consume all characters until the end of the line,
and treats them as arbitrary text which can produce no compilation errors.

```mj
u32 random_number() {
    // chosen by fair dice roll.
    // guaranteed to be random.
    return 4
}
```

## Block Comments

IDEs and external tools use.

## Comment Markup

Comments have builtin support for textual markup. Headings, lists, inline code, tags, and member
documentation are all defined.

Comment markup is intended to be read within the code itself and not introduce complicated syntax
for documentation parsing tools. All markdown is for the user reading the code.

### Comment Tags

Line line and block comments may contain comment tags which provide context for the comment.

```mj
// BUG: This is a bug.
// DEPRECATED: This is deprecated.
// FIXME: This is needs to be fixed.
// HACK: This is a workaround.
// NOTE: This is important.
// OPTIMIZE: This needs to be optimized.
// REVIEW: This needs to be reviewed.
// TODO: This needs to be implemented.
```

### Inline Code

Both block comments and line comments can have inline code. Only Mjolnir code is supported. Language
servers shall parse these code blocks with correct syntax highlighting. This is a benefit of the
language syntax being context free.

Note that string literals may consume the back tick character, so they must be properly terminated
before the closing back tick. Raw strings will also consume up to an including the last single quote
in the line, so the following comments are ill-formed.

```mj
// String literals must be well-formed: `"comments may contain '`' characters"`
// Raw strings in comments `'a raw string'` and `'another raw string'`
// Raw strings in comments `'a raw string'` and `Type&' expression`
// Raw strings in comments `'a raw string'` and `0x11AB'001Cu32`
// Raw strings in comments `'a raw string'`. Aren't safe.
```

### Headings

Block comments can contain section headings which are useful for emphasizing headings within
structured comments. These shall be parsed by the language servers.

They can have hierarchies denoted by the number of `#` characters preceding the heading text.

```mj
/// # Heading 1
/// ## Heading 2
/// ### Heading 3
/// #### Heading 4
/// etc.
```

### Code Blocks

Block comments can contain code blocks, which are multi-line code snippets. Language server shall
parse these code blocks with correct syntax highlighting.

```mj
/// Return the average value of a collection of scalar objects.
///
/// `set` - The set of elements
T average<type T>(Iterable<T>& set) {
    T average;

    for (T &t in set) {
        average += t
    }

    return t / set.size()
}
```

### Lists

Block comments can contain unordered and numbered lists

```mj
///
/// 1) Step 1
/// 2. Step 2
///     - Names
///     - Stuff
///
```

## Documentation

When block comments are placed before some statements such as type or function definitions, variable declarations, and members and properties, they are bound to those elements in the form of documentation.
