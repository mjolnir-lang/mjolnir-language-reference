# Modules

Modules are the units of program.

## Module Structure

All modules share the global namespace.

Module scope is the same as global scope which is a declaration scope which means
all declaractions are parsed at once and declaration order does not matter.

Addresses are global and not offsets as with structures and classes.

Order of members is undefined unless explicitly declared.

## Module Path

System modules - defined in architecture file

Shared modules - set in PATH for user modules

Local modules - defined in the project directory (relative path)

## Module Objects

Modules are compiled into objects for reuse and optimized linting.

If a file of the same path with the file extension `.mjo` is present and
more recently modified on the filesystem, then it will be imported instead of
the source file.

If an object file is not found or is older than the source file, an object file
will be created for reuse.

object file path may be set in project config file with other compilation options
to prevent mixing of source and object files.

## Import Statements

Import statements are used to reference code defined in other source files.

Usually imports are used to express dependency and hierarchy of source files,
but they may also define codependent source files.

There are some modules which are builtins and do not refer to actual source files.

Some modules are local and others may belong to the system or user library layers.

The translation of module names to paths requires that path names not include the `.` character.

The `.` character is used as the path separator and module names may only include these characters: `A-Za-z0-9_-`

Modules do not implicitly create namespaces from their module path, but the module path may be used to disambiguate symbols.

```mj
import a.module.name;
import a_really-123_really_long-name as arrln;
```

## Codependent Import Statements

Codependent imports are a special case. When two or more source files contain
import statements for eachother, they are compiled as one translation unit and
share the module level declaration scope. There are no dependency cycles.

This, along with multipass parsing, remove the need for forward declaration of
types and variables.

## Linting and Compiling

Linters may implement JIT compiling as source files are modified either on the file system or in memory.

This may result in continuous compilation as sources are modified.

## Module Versioning

Semantic versioning is used MAJOR.MINOR.PATCH

where:

MAJOR - breaking API change
MINOR - API change
PATCH - bug fix

git is used to automatically find the most recent commit with the requested version number.
