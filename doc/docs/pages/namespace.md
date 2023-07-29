# The Global Namespace

Programming languages use symbols, numbers, and words taken from written language.
Using English as an example, there are words which have multiple meanings depending
on context, as well as words which may represent something specific depending on
context.

One solution to the global namespace predicament is to introduce a common grouping
which may be used to qualify names as belonging to a group.

However, namespaces based off of structural models may have the most defining
namespace at the beginning of the path or at the end.

Do we use the full path?

We need to make a distinction withing one level of namespace resolution.

If types and modules are ordered from high level to specific, then
the distinction must be high level for some words and low level for others

```mj
import encoding.mj.ast.types.Comment;
import encoding.py.ast.types.Comment;

mj::Comment
py::Comment

fs::Path
::Path

Vector<T>
Vector()
```
