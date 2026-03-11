# The Visitor Pattern

The Visitor pattern has nothing to do with visitors or visiting, and is poorly named.
Instead it describes a method of double dispatch.

## Example

This example is an Abstract Syntax Tree (AST) which is defined in one module and imported in another.
The dependent module must perform a set of operations over all Expression elements of the AST, but
the Expression interface does not expose the necessary methods.

The general approach to this problem in other OOP languages is...

### The AST Module

The AST for this example is a simple expression syntax with numeric literals and mathematical operators.

```txt
(3 * 7.11) - 45 + 18.703
```

The AST uses an `Expression` interface

```mj
@impl(Writable)
interface Expression {
    f64()
}


impl<Expression> f64 {

    f64() => self
}


@impl(Expression)
class UnaryExpression {
    Expression expr

    Self(Expression expr) {
        .expr = expr
    }
}


@impl(UnaryExpression)
class Parentheses {

    f64() => f64(expr)

    @impl(Writable)
    void write_to(Writer& w) => w.write("(\(expr))")
}


@impl(UnaryExpression)
class NegExpression {

    f64() => -f64(expr)

    @impl(Writable)
    void write_to(Writer& w) => w.write("-\(expr)")
}


@impl(Expression)
interface BinaryExpression {
    Expression lhs
    Expression rhs

    Self(Expression lhs, Expression rhs) {
        .lhs = lhs
        .rhs = rsh
    }
}


@impl(BinaryExpression)
class AddExpression {

    f64() => f64(lhs) + f64(rhs)

    @impl(Writable)
    void to_string(Writer& w) => w.write("\(lhs) + \(rhs)")
}


@impl(BinaryExpression)
class SubExpression {

    f64() => f64(lhs) - f64(rhs)

    @impl(Writable)
    void to_string(Writer& w) => w.write("\(lhs) - \(rhs)")
}


@impl(BinaryExpression)
class MulExpression {

    f64() => f64(lhs) * f64(rhs)

    @impl(Writable)
    void to_string(Writer& w) => w.write("\(lhs) * \(rhs)")
}


@impl(BinaryExpression)
class DivExpression {

    f64() => f64(lhs) / f64(rhs)

    @impl(Writable)
    void to_string(Writer& w) => w.write("\(lhs) / \(rhs)")
}
```

`(3 * 7.11) - 45 + 18.703`

```mj
Expression expr = SubExpression(Parentheses(MulExpression(3, 7.11)), AddExpression(45, 18.703))
```
