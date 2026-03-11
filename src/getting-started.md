# Getting Started

This page demonstrates some of the built-in markdown extensions provided by VitePress.

## Syntax Highlighting

VitePress provides Syntax Highlighting powered by [Shiki](https://github.com/shikijs/shiki), with additional features like line-highlighting:

```mj

import testing::import

re(
    \\
    \^
    \$
    \*
    \+
    \?

    \0

    \.
    \|
    \[ \] \{ \} \( \)

    \a
    \b
    \D
    \d
    \e
    \f
    \H
    \h
    \N
    \n
    \O
    \o{17777777777}
    \o
    \P{Print}
    \PC
    \P
    \p{Print}
    \pC
    \p
    \R
    \r
    \S
    \s
    \t
    \uFFFF
    \u
    \v
    \W
    \w
    \X
    \xFF
    \x{7FFFFFFF}
    \x
    \Z
    \z

    ? * + } # { # {} # {1 # {1, # {, # {,} # {,2 # {1} {1,} {,2} {1,2}


    (?= +
        (?!
            (?:and|else|or|then)(?:\b|[<(&])
            |
            [ai]s(?= +[0-9A-Za-z])
        )
        [~*&+\-]*
        [0-9A-Za-z_\[({"']
    )


    ^ $ \A \B \b \G \K \Y \y

    \g<name>
    \k<name>
    \k<name+1>
    \k<2-1>
    \k<+3>
    \k<>
    \1
    \3

    . |

    (asdf)
    (?asdf)
    (?:asdf)
    (?=as|df)
    (?!asdf)
    (?<=asdf)
    (?<!asdf)
    (?>asdf)
    (?<name>asdf)
    (?~asdf)
    (?~|asdf)
    (?~|asdf|asdf)
    (?~|)

    (?(asdf)asdf|asdf)
    (?(<2>)asdf|asdf)
    (?(<-2>)asdf|asdf)
    (?(<+2>)asdf|asdf)
    (?(<name>)asdf|asdf)
    (?(<name+2>)asdf|asdf)

    (?{...contents...}[tag]>)

    (*name)
    (*name{args...})
    (*name[tag])
    (*name[tag]{args...})

    [ \b [^sd] |^$?*+ \\ \[ \] \- ]
    [0-9]
    [^x&&d]
)

re(sdf sdfs | \\ [\\0-9A-Z])


${
    git clone
    git pull
}

$ git status --init * --pwd=~/path*.sh[2-5]??.tar/{ew,dsd,*} ${HOME}_old $HOME $(md5sum $file) "sdf\x32" "\(fun(32) + 4)" stderr>(buffer) | git clone

$(shell --command arg 45)

fun($ENV_VAR.parse<n32>() - 3)

$VAR

$ git clone --all


// Comments

// Documentation Comments

/// # Heading 1
/// ## Heading 2
/// ### Heading 3
/// #### Heading 4

/// TODO This needs to be implemented.
/// TODO: This needs to be implemented.
/// NOTE This is important.
/// NOTE: This is important.
/// FIXME This is broken.
/// FIXME: This is broken.
/// XXX This is a bug.
/// XXX: This is a bug.
/// BUG This is a bug.
/// BUG: This is a bug.

/// `U*[7]*const xxx = inline + code`

// string: `{ads` sdfgsdfg

/// ```
/// String code_block = "Anything between triple back-ticks."
///
/// // Event comments.
///
/// Box<T> func<type T>(T& t) {}
///     return Box<T>(t)
/// }
/// ```


String x = '
    asdf  a sdfasdf  ''   '' asdfasdf'
    sadfasdfasdf
'ascii

String y = 'asdasdasffdfs wses'ascii

"\x12 \1 \x2 \0 \021 \(32 km/s + {0}) {32}"utf8

String x = "
    \x12
    \1
    \x2
    \0
    \021
    \(32 km/s + {0})
    {32}
"utf8

void func() {
    String esc = "
        str
        abc
        ~~
        xyz
        end
    "
}

Array<int> = new()
Array<int> = new<U>()

n32 10_BIT_MODE

int#m/s*

re(
    [0-9]*(?:
        [A-Z][0-9A-Z+-]*[a-z]
        |[a-z][0-9a-z+-]*[A-Z]
    )[A-Za-z0-9+-]*

    \b(?:
        (?:[0-9][0-9+-]*)?[A-Z][0-9A-Z+-]*[a-z+-][0-9A-Za-z+-]*
        |(?:
            [A-Z]
            |(?:
                [dinq]
                |f(?!8|12)
            )(?:8|16|32|64|128)(?:x(?:2|4|8|16|32|64))?
            |int
            |nat
            |re
            |bool
            |void
        )\b
    )


    [0-9_]*[a-z][0-9a-z_]*
    [0-9_]*[A-Z][0-9A-Z_]*
)

1-Wire

1-C
2+C

+C

C+x+
Cx++
C++
C++::


// Type Declarations

class Class {

    if () {
        break
    } else {
        do {
            break
            continue
            return
            yield
            fail
        } while () {
            //
        } then {
            // no break
        } else {
            // break
        }
    }
}


type This = Other
unit fd = sdfs

if unit or unit then unit else

for Type var in expr
for Type in in expr
for Type in in in
for var in expr
for in in expr
for in in in

x = 7n

while if x then 3 else 5 {

}

// If-Else Expression
n32 result = if cond() then 34 else 7

// Use Expression
n32 result = use fun()

// Try Expression
n32 result = try fun() else 34

// Try Expression
n32 result = try fun()
    catch FileError => // uncaptured error value of class
    catch Error error => // captured error value of class
    catch error => // captured error value of any class
    else // uncaptured error value of any class

// Try Statement
try {
    n32 result = fun()
} then {
    // no error
} catch FileError {
    // uncaptured error value of class
} catch IoError error {
    // captured error value of class
} then {
    // runs after `FileError` or `IoError`
} catch error {
    // captured error value of any class
} else {
    // uncaptured error value of any class
} else while x > 3 {
    if x < -2 {
        break
    }
} then {
    //
    break
} then {

} else {
    //
}


n32 x = match n32 var := expr()
    case C++ => []() {
        if (expr(2)) {
            var++;
        }

        return var
    }()
    case Rust => {
        if expr(2) {
            var++;
        }

        var
    }
    case Mjolnir => {
        if expr(2) {
            var++
        }
    } => var
    else 0


n32 fn(n32 x) => x * 2

n32 fn(n32 x) {
    return x * 2
}




T fn<type T, Natural U>(Slice<T> x, U y) => x * y




n32(n32)* y2 = (x, y) => y - x + 7

n32 z = y2(7)

n32 y = if try fun() else false
    then 7
    else if ex()
        then use df()
        else match expr()
            case 2 => 32
            case 7 => try fun()
                catch FileError => fail 2
                catch Error error => fail error - 32
                catch error => fail error
                else 7
            else 0

// Match Expression
n32 x = match expr()
    case 2 => 32
    case 5 => []() { n32 var = 35; var += 2; return var; }()
    case 5 => { let var: n32 = 35; var += 2; var }
    case 5 => { n32 var = 35; var += 2 } => var
    else 0

// Match Expression (nested)
n32 x = match match expr()
            case 2 => 32
            case 7 => 37
            else 0
    case 37 => 73
    else 0

// Match Statement
n32 x
match expr() {
    case 0 {
        x = 30
    } case 1 {
        x = 31
    } case 2 {
        x = 32
    } then {
        log("x <= 2")
    } case 7 {
        x = 37
    } else {
        x = 0
    } then {
        // 
    }
}


n32 x
match expr() case 0 {
    x = 30
} case 1 {
    x = 31
} case 2 {
    x = 32
} then {
    log("x <= 2")
} case 7 {
    x = 37
} else {
    x = 0
} then {
    // 
}


q32 var = 12 + 31/344q16
q32 var = 12+31/344q16


1.65e-12 µg/°F
1.65e-12 1/s
1.65e-12 Ω³
1.65e-12 ^g
1.65e-12 °
1.65e-12 '
1.65e-12 "

#3.5·µg/°F
#1/s
#s⁻¹
#Ω³
#^g



n32#2π·µg/°F
n32#1/s
n32#Ω³
n32#^g

n32#°
n32#'
n32#"

unit m/s

enum<n32> Things {
    XXX = 0
}

Number
Numeric
Scalar

// Real
Integer integer = 3211288I
Fraction fraction = 31123/66655Q
Decimal decimal = 34.5678D
Float float = 32.4444e11212221F

// Imaginary
Imaginary<f32>

// Complex
Complex<n16> 

n32 y = 2 << 3 | 34 >> 3
y <<= 3
y >>= 3

unit<s⁰¹²³⁴⁵⁶⁷⁸⁹⁻⸍>


T#u² pow2<type T, unit u>(T#u arg) {
    return arg * arg
}


// Generic Type Declarations

class GenericClass<type T, type V, n32#kg·m/s² SIZE> {
    V& v


    GenericClass(T value, const T&' n2, T**'(void*[64u32])* callback, V v) {
        this.value = value
        this.u = not n2 and 77 kg·m/s² or 6 != asdf
        this.v = v
    }


    V&' method<type T>()
    where<
        T is Comparable,
        U is Equatable<T> | Comparable<T> | Gd4-65v | IEEE-802.11:: | xx.dd | Gd4-65v
    > {
        return v
    }


    @api(1.2)
    @deprecated(3)
    V generic_method<type A>(safe; A& a) {
        return n32(a) * &asd
    }

    [9:0] bitfield<n8> {
        
    }

    void? call() {
        fail
    }
}


T#u² pow2<type T, unit u>(T#u arg) { // [!code highlight]
    return arg * arg // [!code warning]
} // [!code error]
```

## Custom Containers

::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::

## More

Check out the documentation for the [full list of markdown extensions](https://vitepress.dev/guide/markdown).
