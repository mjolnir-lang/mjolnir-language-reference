# Token

## Encoding

Source files are encoded in binary form as a stream of tokens

Tokens are variably sized byte sequences beginning with an ID byte and followed by zero or more
metadata bytes

Tokens are either symbols or identifiers or inline encoded data.

Some tokens are metadata for the file or invalid.

Some tokens are sub-tokens and are located on top of the preceding token, like escape sequences in a
string and base prefixes and suffixes for numeric literals.

- Symbols have a one-to-one mapping from token ID to text
  - Or many-to-one when many token IDs map to the same text
- Patterns have a one-to-many mapping from token ID to text
  - Trailing data in the token encoding will determine the text of the token
    - references to interned string literals (string ID)
    - inline string data (raw text with size)
    - trailing subtokens (tokens with subtoken count)
    - whitespace rules (implicit space between tokens)
    - compressed data (count of whitespaces/indents)

## Parsing

Encoding rules

- Whitespace rules
- pattern or symbol
- special encoding rules

Some tokens are context dependent.

- NONE

- INVALID

- INDENT

- WHITESPACE

- INVALID_IDENTIFIER

Single

- AND
- AS
- ASM
- BITFIELD
- BREAK
- CASE
- CATCH
- CLASS
- CONTINUE
- DO
- ELSE
- ENUM
- FAIL
- FOR
- IF
- IMPL
- IMPORT
- IN
- INTERFACE
- IS
- MATCH
- NOT
- OR
- RETURN
- STRUCT
- THEN
- TRY
- TYPE
- UNION
- UNIT
- UNTIL
- USE
- WHERE
- WHILE
- YIELD

- CONST
- SAFE

TRUE
FALSE
NULL
UNINITIALIZED

INVALID_IDENTIFIER
ANNOTATION_NAME
VARIABLE_NAME
FUNCTION_NAME
CONSTANT_NAME
TYPE_NAME
NUMERIC_LITERAL
UNIT_EXPRESSION

STRING_LITERAL
STRING_EXPRESSION

LINE_COMMENT
FORMATTED_LINE_COMMENT
BLOCK_COMMENT
FORMATTED_BLOCK_COMMENT

## Separators

| Token  | Name                    |
| ------ | ----------------------- |
| `::`   | Shared Member Accessor  |
| `.`    | Member Accessor         |
| `,`    | Comma                   |
| `;`    | Semicolon               |
| `:`    | Colon                   |
| `(`    | Open Parenthesis        |
| `)`    | Close Parenthesis       |
| `[`    | Open Square Bracket     |
| `]`    | Close Square Bracket    |
| `{`    | Open Curly Brace        |
| `}`    | Close Curly Brace       |
| `<`    | Open Angle Bracket      |
| `>`    | Close Angle Bracket     |

Prefix Operator (must have no space on right)

INVERT{58};                 // `~expr`
NEGATE{59};                 // `-expr`
DEREFERENCE{60};            // `*expr`
REFERENCE{61};              // `&expr`
SHELL_SHORT_OPTION{62};     // `-\w`
SHELL_LONG_OPTION{63};      // `--\w+(-\w+)*`

Postfix Operator (must have no space on left)

INCREMENT{64};               // `expr++`
DECREMENT{65};               // `expr--`
FUNCTION_REFERENCE{66};      // `func&`
POINTER_TYPE_MODIFIER{67};   // `type*`
REFERENCE_TYPE_MODIFIER{68}; // `type&`
FALLIBLE_TYPE_MODIFIER{69};  // `type?`
NO_RETURN_TYPE_MODIFIER{70}; // `type!`

Infix Operator (must have space on both sides)

| Text | Kind |
| --- | --- |
| `=` | `SET` |
| `==` | `EQUAL` |
| `=>` | `LAMBDA` |
| `<` | `LESS_THAN` |
| `<<` | `LEFT_SHIFT` |
| `<<=` | `LEFT_SHIFT_SET` |
| `<=` | `LESS_THAN_OR_EQUAL` |
| `<=>` | `SPACESHIP` |
| `>` | `GREATER_THAN` |
| `>>` | `RIGHT_SHIFT` |
| `>>=` | `RIGHT_SHIFT_SET` |
| `>=` | `GREATER_THAN_OR_EQUAL` |
| `*` | `MULTIPLY` |
| `*=` | `MULTIPLY_SET` |
| `/` | `DIVIDE` |
| `/=` | `DIVIDE_SET` |
| `%` | `REMAINDER` |
| `%=` | `REMAINDER_SET` |
| `+` | `PLUS` |
| `+=` | `PLUS_SET` |
| `-` | `MINUS` |
| `-=` | `MINUS_SET` |
| `&` | `BITWISE_AND` |
| `&=` | `BITWISE_AND_SET` |
| `\|` | `BITWISE_OR` |
| `\|=` | `BITWISE_OR_SET` |
| `^` | `BITWISE_XOR` |
| `^=` | `BITWISE_XOR_SET` |
| `!=` | `NOT_EQUAL` |

Separator (no space)

SCOPE
DOT

Separator (trailing space)

COMMA
SEMICOLON
COLON

Misc (no space)

HASH{109};                 // `#`
DOLLAR_SIGN{110};          // `$`
AT{111};                   // `@`

Braces (no space)

SINGLE_QUOTE
DOUBLE_QUOTE
OPEN_PARENTHESIS
CLOSE_PARENTHESIS
OPEN_SQUARE_BRACKET
CLOSE_SQUARE_BRACKET
OPEN_CURLY_BRACE
CLOSE_CURLY_BRACE
OPEN_ANGLE_BRACKET (dup?)
CLOSE_ANGLE_BRACKET (dup?)

Duplicate tokens

GLOBAL_LIFETIME (double quote)
LOCAL_LIFETIME (single quote)
OPEN_CAST (OPEN_PAREN)
CLOSE_CAST (CLOSE_PAREN)
OPEN_TYPE (OPEN_PAREN)
CLOSE_TYPE (CLOSE_PAREN)
OPEN_SHELL_EXPRESSION (OPEN_PAREN)
CLOSE_SHELL_EXPRESSION (CLOSE_PAREN)

Subtokens

NUMERIC_LITERAL_PREFIX{126};    // `0[box]`
NUMERIC_LITERAL_SUFFIX{127};    // `[fiu](8|16|32|64|128)`
CHARACTER_ESCAPE_SEQUENCE{128}; // `\.*`
INVALID_ESCAPE_SEQUENCE{129};   // `\.*`
