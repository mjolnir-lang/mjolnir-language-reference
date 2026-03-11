# Heap Allocated Object Properties

Classes and structures are composed of a sequence of member variables. These
are stored in the memory of that object.

Given that some objects perform one or more heap allocations, would there be
any benefit to storing members in that heap allocation?

Account for the impacts of potential reallocation, number of pointer
indirections, cache locality, and heap vs stack space constraints.
