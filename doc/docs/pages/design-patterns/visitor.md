# Visitor

The Visitor pattern has nothing to do with visitors or visiting, and is poorly named.
Instead it describes a method of double dispatch.

## Example

This example is an Abstract Syntax Tree (AST) which is defined in one module and imported in another.
The dependent module must perform a set of operations over all Expression elements of the AST, but
the Expression interface does not expose the necessary methods.

The general approach to this problem in other OOP languages is to 

### The AST Module

The AST for this exammple is a simple expression syntax with numeric literals and mathmatical operators.

```txt
(3 * 7.11) - 45 + 18.703
```

The AST uses an `Expression` interface to.

```mj
interface Expression {
    void print(File &out);
    Number evaluate();
}


interface Operator {
}


class AddOperator {
    String symbol;
    Expression lhs;
    Expression rhs;


    AddOperator(String symbol, Expression lhs, Expression rhs) {
        (this.symbol, this.lhs, this.rhs) = (symbol, lhs, rsh);
    }
}

implementation<Operator> AddOperator;


class SubOperator {
    String symbol;
    Expression lhs;
    Expression rhs;


    SubOperator(String symbol, Expression lhs, Expression rhs) {
        (this.symbol, this.lhs, this.rhs) = (symbol, lhs, rsh);
    }
}


class MulOperator {
    String symbol;
    Expression lhs;
    Expression rhs;


    MulOperation(String symbol, Expression lhs, Expression rhs) {
        (this.symbol, this.lhs, this.rhs) = (symbol, lhs, rsh);
    }
}


class DivOperator {
    String symbol;
    Expression lhs;
    Expression rhs;


    DivOperation(String symbol, Expression lhs, Expression rhs) {
        (this.symbol, this.lhs, this.rhs) = (symbol, lhs, rsh);
    }
}


class Parenthesis {
    Expression expression;


    Operation(Expression expression) {
        this.expression = expression;
    }


    Expression &'expression() {
        return expression;
    }
}


class Number {
    variant {
        i32 as_i32;
        f32 as_f32;
    } value;


    Number(i32 value) {
        this.value = value;
    }


    Number(f32 value) {
        this.value = value;
    }
}


implementation<Expression> Operator {
    void print(File &out) {
        out.write();
    }


    Number evaluate() {
        return Number(this);
    }
}


Expression expr = Operator()


```
