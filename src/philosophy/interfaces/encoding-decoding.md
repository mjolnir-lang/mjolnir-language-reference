# Encoding

An encoding is a structured representation of information within a medium. This
is different from a format which is a structure representation of data on top
of an encoding.

Encoding is used for transport, while format is used for information.

An encoding is usually a binary structure that does not represent information
directly, but provides a layer upon which information may be transported.

Character encodings like ASCII and UTF-16 define how characters are repesented
in binary, but JSON and XML are formats which give meaning to the characters.

Every format could instead be an encoding, but that would result in too many
similar standards for character based data formats. For this reason,
encoding may be considered a transport layer, and format may be considered
a data layer.

Unicode is a weird middle ground where is has multiple encodings and is
not quite a format. It is an abstract encoding.

## Decode

Decoding must handle errors

## Encode

Encoding should have very few errors. Any errors are likely the result
of environment issues (out of memory, connection lost, etc.) or potentially
and invalid use of the encoding for which there is no well defined routine to
handle the condition.

## Heterogenous/Homogenous

Character encosings and other stream base transport layers are usually
homogenous and often have and native intermediate representation.

Complicated binary file strucures are usually heterogenous and often have a
specialized intermediate representation.
