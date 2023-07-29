# Mjolnir Abstract Syntax Tree (AST)

The Mjolnir AST is a token based representation of Mjolnir source code.

## Variables

While representing variables, storage is not always known. For managing
this issue, variables are defined as either **bound** or **unbound**.

Bound variables are associated with storage, so they constitute valid objects
within the AST. This is almost an optimization.. Might remove since objects
imply state. Should probably only be used for constants...

Unbound variables make up the majority of cases. They are identifiers whose
storage is dependent on context and execution, so they are not bound to an
object.
