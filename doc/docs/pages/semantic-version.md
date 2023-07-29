# Semantic Versioning

Code is organized onto libraries and modules.

As bugs are fixed and features are added or removed, the library must
distinguish between version of itself for programs which depend on a
specific advertised set of features.

Ideally versioning for all libraries and modules would follow the same
format. Most prevalent today is Semantic Versioning.

Semantic Versioning encodes a version in three integers separated by `.`
characters, in the form of `major.minor.patch`. Where the `major` version
number is incremented when breaking changes are introduced, the `minor`
version number is incremented when new features are added, and the
`patch` version number is incremented when bugs are fixed but no new
features are added. When version number is incremented the lower
numbers are reset to `0`.

With semantic versioning it is important tha compatibility be indicated
by comparing major version equality and minor version greater than or equal.
Patch is not considered, but should always be highest available.

While there is merit to releasing packaged versions of libraries or tagging commits
in version control, Mjolnir uses annotations to declare the features provided
by a version so that the same code may be compiled as a specific version.

Annotations may also define limitations of the implementation such as
dependence on a specific platform, architecture, or operating system API,
or provide alternate implementations for multiple targets.

This function is annotated such that it will only be included if the library
is major version 1 and minor version greater than or equal to 0.

```mj
@api(1.0)
void function() {
    // ...
}
```

This function declares a dependence on the Vulkan library version.

```mj
@target(vulcan < 1.3)
@api(1.3)
void function() {
    // ...
}

@target(vulcan >= 1.3)
void function() {
    // ...
}
```

No program should depend on a specific patch number, but if the program detects that the
patch number of a dependency is out of date, it should complain.
