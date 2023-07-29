# Functions

Functions are constant variables, whose data is stored in instruction data.

Procedure - A function which does not return a value
Subroutine - A function which returns a value

## Syntax

Functions are 

## Style

```mj
u32 calculate(Expression &expr) = {
    // ...
}
```

## Parameters

A parameter represents a value that the function expects you to pass when you call it. The procedure's declaration defines its parameters.

When you define a function, you specify a parameter list in parentheses immediately following the procedure name. For each parameter, you specify a name, a data type, and a passing mechanism. You can also indicate that a parameter is optional. This means that the calling code does not have to pass a value for it.

The name of each parameter serves as a local variable in the procedure. You use the parameter name the same way you use any other variable.

## Arguments

An argument represents the value that you pass to a procedure parameter when you call the procedure. The calling code supplies the arguments when it calls the procedure.

When you call a function, you include an argument list in parentheses immediately following the procedure name. Each argument corresponds to the parameter in the same position in the list.

In contrast to parameter definition, arguments do not have names. Each argument is an expression, which can contain zero or more variables, constants, and literals. The data type of the evaluated expression should typically match the data type defined for the corresponding parameter, and in any case it must be convertible to the parameter type.

## Overloading

Function overloading is the process by which overloaded functions are declared. It is common for multiple functions
to have the same purpose yet accept different parameters. For convenience, the name may be shared by multiple
functions so long as they are distinguishable by parameter list.

Functions may not be overloaded by return type alone, since that is not enough to resolve ambiguity in most cases.
