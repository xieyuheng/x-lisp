---
title: Syntax
---

# Preface

meta-lisp uses **S-expression** syntax.

- The module top level consists of **statements**.
- Statements are composed of **expressions**.

All meta-Lisp syntax is presented below in groups.

# Table of Contents

- [Preface](#preface)
- [Table of Contents](#table-of-contents)
- [Comments](#comments)
  - [Line comments](#line-comments)
  - [(@comment)](#comment)
- [Literals](#literals)
  - [Atoms](#atoms)
  - [(@list)](#list)
  - [(@set)](#set)
  - [(@hash)](#hash)
  - [(@text)](#text)
  - [(@quote)](#quote)
  - [(@sexp)](#sexp)
- [Variables](#variables)
  - [(define)](#define)
  - [Variables](#variables-1)
  - [Qualified variables](#qualified-variables)
- [Functions](#functions)
  - [Function application](#function-application)
  - [(lambda)](#lambda)
  - [(define)](#define-1)
- [Types](#types)
  - [Atomic types](#atomic-types)
  - [Container types](#container-types)
  - [(->)](#-)
  - [(claim)](#claim)
  - [(admit)](#admit)
  - [(the)](#the)
  - [(all)](#all)
  - [(define-type)](#define-type)
- [Conditionals](#conditionals)
  - [(if)](#if)
  - [(when)](#when)
  - [(unless)](#unless)
  - [(cond)](#cond)
  - [(and)](#and)
  - [(or)](#or)
- [Sequencing and bindings](#sequencing-and-bindings)
  - [(begin)](#begin)
  - [(let)](#let)
  - [(letrec)](#letrec)
  - [local (define)](#local-define)
- [Function composition](#function-composition)
  - [(flow)](#flow)
  - [(chain)](#chain)
  - [(compose)](#compose)
- [Algebraic data types](#algebraic-data-types)
  - [(define-algebraic-type)](#define-algebraic-type)
  - [(define-record-type)](#define-record-type)
  - [(define-enum)](#define-enum)
  - [(define-struct)](#define-struct)
  - [(match)](#match)
- [Opaque types](#opaque-types)
  - [(define-opaque-type)](#define-opaque-type)
- [Modules](#modules)
  - [(module)](#module)
  - [(import)](#import)
  - [(import-as)](#import-as)
  - [(import-all)](#import-all)
  - [(private)](#private)
- [Testing](#testing)
  - [(define-test)](#define-test)

# Comments

## Line comments

Comments start with `;` and extend to the end of the line.

Lisp programmers typically write two `;;` for line comments.

```meta-lisp
;; This is a comment
(define x 42) ;; end-of-line comment
```

## (@comment)

```meta-lisp
(@comment <sexp> ...)
```

`(@comment)` is ignored at compile time and evaluates to `void`.

```meta-lisp
(@comment (lambda (<parameter> ...)
            <body>))
(@comment (if <condition> <consequent> <alternative>))
(@comment foo bar)
```

`@comment` is recognized as a syntactic keyword by the parser. Its content is a literal S-expression that is not evaluated.

# Literals

## Atoms

Integers consist of digits, with an optional negative sign.

```meta-lisp
42
-1
0
```

Floats have a decimal point.

```meta-lisp
3.14
-2.5
```

Strings are wrapped in double quotes.

```meta-lisp
"hello"
""
```

Symbols start with a single quote followed by a name.

```meta-lisp
'foo
'bar
```

Booleans are `true` and `false` — they are not literals, but variables bound to boolean values.

The void value is `void` — also not a literal, but a variable bound to the void value.

## (@list)

```meta-lisp
[<exp> ...]
(@list <exp> ...)
```

Creates a list.

```meta-lisp
[1 2 3]
["a" "b" "c"]
```

Bracket notation `[...]` is syntactic sugar for `(@list ...)`.

The example above is equivalent to:

```meta-lisp
(@list 1 2 3)
(@list "a" "b" "c")
```

The `@` prefix avoids occupying the variable name `list`.

## (@set)

```meta-lisp
(@set <exp> ...)
```

Creates a set.

```meta-lisp
(@set 1 2 3)
```

## (@hash)

```meta-lisp
(@hash <key> <value> ...)
```

Creates a hash table.

```meta-lisp
(@hash 'a 1 'b 2)
(@hash "a" 1 "b" 2)
```

## (@text)

```meta-lisp
(@text <exp> ...)
```

Concatenates text expressions into a single text.

```meta-lisp
(@text "hello" " " "world")
(@text "(" x ")")
(@text)
```

The example above is equivalent to:

```meta-lisp
(text-concat ["hello" " " "world"])
(text-concat ["(" x ")"])
(text-concat [])
```

## (@quote)

```meta-lisp
'<sexp>
(@quote <sexp>)
```

Create list of symbols or literal atoms.

```meta-lisp
'(a b c)         ;; => ['a 'b 'c]
'(1 2 3)         ;; => [1 2 3]
```

Equivalent to:

```meta-lisp
(@quote (a b c))  ;; => ['a 'b 'c]
(@quote (1 2 3))  ;; => [1 2 3]
```

## (@sexp)

```meta-lisp
(@sexp <sexp>)
```

Converts an s-expression into a `sexp-t` value, preserving source location information for each sub-node.

The `sexp-t` type is defined as:

```meta-lisp
(define-enum sexp-t
  (symbol-sexp (content symbol-t) (location source-location-t))
  (text-sexp (content text-t) (location source-location-t))
  (int-sexp (content int-t) (location source-location-t))
  (float-sexp (content float-t) (location source-location-t))
  (list-sexp (elements (list-t sexp-t)) (location source-location-t)))
```

Usage examples:

```meta-lisp
(@sexp foo)           ;; => (symbol-sexp 'foo <location>)
(@sexp (a b c))       ;; => (list-sexp
                      ;;      (list (symbol-sexp 'a) (symbol-sexp 'b) (symbol-sexp 'c))
                      ;;      <location>)
```

# Variables

## (define)

```meta-lisp
(define <name> <exp>)
```

Defines a module-level variable.

```meta-lisp
(define answer 42)
(define greeting "hello")
```

## Variables

A variable references a bound name.

Names consist of letters, digits, `-` and other characters.

```meta-lisp
x
factorial
list-length
list-is-empty
```

## Qualified variables

`<module-name>/<name>` references a name from another module.

```meta-lisp
builtin/list-length
builtin/list-is-empty
```

Qualified names can be used directly without `(import)`.
`(import)` is specifically for removing the `<module-name>` prefix.

# Functions

## Function application

```meta-lisp
(<target> <arg> ...)
```

Function application is the most important syntax.

If the first position of an S-expression is not a syntactic keyword, it is treated as a function application.

The first position is the function, the rest are arguments.

The function expression is evaluated first,
then all argument expressions are evaluated,
then the function is applied.

```meta-lisp
(iadd 1 2)
(println "hello")
((lambda (x) x) 1)
```

When a function is applied with insufficient arguments, partial application occurs (via **currying**).

```meta-lisp
((iadd 1) 2)
```

Equivalent to:

```meta-lisp
(iadd 1 2)
```

And `(iadd 1)` can be passed as a value to other functions or returned as a result.

```meta-lisp
(define add1
  (iadd 1))
```

Equivalent to:

```meta-lisp
(define (add1 x)
  (iadd 1 x))
```

## (lambda)

```meta-lisp
(lambda (<parameter> ...)
  <body>)
```

Creates an anonymous function.

`(<parameter> ...)` is the formal parameter list,
`<body>` is one or more expressions.
When the function is applied, actual arguments are bound to the formal parameters, then `<body>` is evaluated.

```meta-lisp
(lambda (x) (iadd x 1))
((lambda (x) (iadd x 1)) 2)  ;; => 3
```

Multiple parameters:

```meta-lisp
(lambda (x y)
  (iadd x y))
```

Equivalent to:

```meta-lisp
(lambda (x)
  (lambda (y)
    (iadd x y)))
```

## (define)

```meta-lisp
(define (<name> <parameter> ...)
  <body>)
```

Defines a function.

Defining a function is equivalent to defining a variable whose value is a lambda.

```meta-lisp
(define (add1 x)
  (iadd 1 x))
```

Equivalent to:

```meta-lisp
(define add1
  (lambda (x)
    (iadd 1 x)))
```

The function body `<body>` can be multiple expressions:

```meta-lisp
(define (f x)
  (let ((y (iadd x 1)))
    (imul y 2)))
```

# Types

## Atomic types

| Type        | Description   | Example                        |
|-------------|---------------|--------------------------------|
| `int-t`     | Integer       | `42` `-1`                      |
| `float-t`   | Float         | `3.14` `-2.5`                  |
| `text-t`  | String        | `"hello"`                      |
| `symbol-t`  | Symbol        | `'foo`                         |
| `bool-t`    | Boolean       | `true` `false`                 |
| `void-t`    | Void          | `void`                         |
| `file-t`    | File          | `(open-input-file "abc.txt")`  |

## Container types

| Type           | Description                       |
|----------------|-----------------------------------|
| `(list-t E)`   | List of elements of type `E`      |
| `(set-t E)`    | Set of elements of type `E`       |
| `(hash-t K V)` | Hash table with keys `K` and values `V` |

## (->)

```meta-lisp
(-> <arg-type> ... <ret-type>)
```

Function type.

Takes `<arg-type>` parameters and returns `<ret-type>`.

For example:

```meta-lisp
(-> int-t int-t)
(-> int-t int-t int-t)
(-> text-t bool-t)
```

## (claim)

```meta-lisp
(claim <name> <type>)
```

Declares the type of a name.

The compiler infers the type from `(define)`'s `<body>` and checks it against the `(claim)`.

```meta-lisp
(claim add1 (-> int-t int-t))
(define (add1 x) (iadd x 1))

(claim answer int-t)
(define answer 42)
```

## (admit)

```meta-lisp
(admit <name> <type>)
```

Admits the type of a name.

Similar to `(claim)`, but the compiler does not check the `(define)`'s `<body>`.

```meta-lisp
(admit make-point (-> float-t float-t point-t))
(define (make-point x y)
  (@list 'make-point x y))
```

## (the)

```meta-lisp
(the <type> <exp>)
```

Explicitly annotates `<exp>` with a type.

The compiler checks whether `<exp>`'s actual type matches. Useful for clarifying intent or helping type inference.

```meta-lisp
(the int-t 42)
(the (-> int-t int-t)
  (lambda (x)
    (iadd x 1)))
```

## (all)

```meta-lisp
(all (<type-parameter> ...)
  <type>)
```

A type containing type variables.

Type variables are usually single uppercase letters, referenced within `<type>`.
Used in `claim` for generic function signatures.

```meta-lisp
(claim identity (all (A) (-> A A)))

(claim car (all (E) (-> (list-t E) E)))
(claim cdr (all (E) (-> (list-t E) (list-t E))))
(claim cons (all (E) (-> E (list-t E) (list-t E))))
```

## (define-type)

```meta-lisp
(define-type <type-name>
  <body>)

(define-type (<type-name> <type-parameter> ...)
  <body>)
```

Defines a new type. `<type-name>` becomes a type constructor, and `<body>` is an expression that evaluates to a type.
With type parameters, the parameters can be referenced within `<body>`.

For example:

```meta-lisp
(define-type (non-empty-list-t A)
  (pair-t A (list-t A)))
```

Usage:

```meta-lisp
(the (non-empty-list-t int-t) (make-pair 1 [2 3]))
```

# Conditionals

## (if)

```meta-lisp
(if <condition>
  <consequent>
  <alternative>)
```

Conditional branch.

`<condition>` is evaluated.
If true, `<consequent>` is evaluated and returned.
Otherwise, `<alternative>` is evaluated and returned.

```meta-lisp
(define (abs x)
  (if (int-less x 0)
    (ineg x)
    x))
```

## (when)

```meta-lisp
(when <condition>
  <body>)
```

Executes when condition is true. Used for side effects.

When `<condition>` is true, `<body>` is evaluated; otherwise skipped.
`<body>` can contain multiple expressions.
A `(when)` expression always returns `void`.

```meta-lisp
(when is-debug
  (print "debug mode")
  (newline))
```

## (unless)

```meta-lisp
(unless <condition>
  <body>)
```

Executes when condition is false. Used for side effects.

When `<condition>` is false, `<body>` is evaluated; otherwise skipped.
`<body>` can contain multiple expressions.
An `(unless)` expression always returns `void`.

```meta-lisp
(unless (equal x 0)
  (print (idiv 1 x))
  (newline))
```

## (cond)

```meta-lisp
(cond
  (<question> <answer>)
  ...)
```

Multi-branch conditional.

Each `<question>` is evaluated in order.
The `<answer>` of the first true branch is evaluated and returned.
The last `<question>` can be `else` as the default branch.

```meta-lisp
(define (classify x)
  (cond
   ((int-is-positive x) "positive")
   ((int-is-negative x) "negative")
   (else "zero")))
```

## (and)

```meta-lisp
(and <exp> ...)
```

Short-circuit and.

Evaluates left to right. Stops and returns the value at the first false. Returns the last value if all are true.

```meta-lisp
(and (is-int x) (int-is-positive x))
```

Returns `true` with zero arguments.

## (or)

```meta-lisp
(or <exp> ...)
```

Short-circuit or.

Evaluates left to right. Stops and returns the value at the first true. Returns the last value if all are false.

```meta-lisp
(or (equal x 0) (equal x 1))
```

Returns `false` with zero arguments.

# Sequencing and bindings

## (begin)

```meta-lisp
(begin <body>)
```

Sequential execution.

`<body>` can be multiple expressions `<exp> ...`,
evaluated in order. Returns the value of the last expression.
Earlier expressions are typically for side effects.

```meta-lisp
(begin
  (println "step 1")
  (println "step 2")
  42)  ;; => 42
```

The `<body>` of `(lambda)` and `(define)` function bodies both work like `(begin)`'s `<body>`.

```meta-lisp
`(define (f x)
  (let ((y (iadd x 1)))
    (imul y 2)))
```

## (let)

```meta-lisp
(let ((<name> <exp>)
      ...)
  <body>)
```

Sequential local variable bindings.

Each `<exp>` can reference previously bound names.

```meta-lisp
(let ((x 1))
  (iadd x 1))  ;; => 2

(let ((x 1)
      (y 2))
  (iadd x y))  ;; => 3

(let ((x 1)
      (y (iadd x 1)))
  (iadd x y))  ;; => 3
```

## (letrec)

```meta-lisp
(letrec ((<name> <exp>)
         ...)
  <body>)
```

Similar to `(let)`, but supports recursion and mutual recursion.

All `<exp>`s can reference all `<name>`s.

Mutual recursion:

```meta-lisp
(letrec ((is-even
          (lambda (n)
            (if (equal n 0)
              true
              (is-odd (isub n 1)))))
         (is-odd
          (lambda (n)
            (if (equal n 0)
              false
              (is-even (isub n 1))))))
  (assert (is-even 4)))
```

Sequential dependency:

```meta-lisp
(letrec ((a 1)
         (b (iadd a 1)))
  b)  ;; => 2
```

## local (define)

```meta-lisp
(define (<name> <parameter> ...) <body>)
(define <name> <exp>)
```

Local recursive variable bindings in `<body>`.

Allows `(define)` inside `<body>`.
Replaces nested `(letrec)` to reduce indentation.

Mutual recursion (equivalent to the `(letrec)` example above):

```meta-lisp
(begin
  (define (is-even n)
    (if (equal n 0)
      true
      (is-odd (isub n 1))))
  (define (is-odd n)
    (if (equal n 0)
      false
      (is-even (isub n 1))))
  (is-even 4))
```

Sequential dependency:

```meta-lisp
(begin
  (define a 1)
  (define b (iadd a 1))
  b)  ;; => 2
```

`(let)` and `(define)` can be mixed:

```meta-lisp
(begin
  (let ((one 1))
    (define a one)
    (define b (iadd a one))
    b))  ;; => 2
```

# Function composition

## (flow)

```meta-lisp
(flow <init> <step> ...)
```

Flow.

Passes `<init>` to the first `<step>`, the result to the second `<step>`, and so on.

```meta-lisp
(flow 5 add1 double)        ;; => 12
(flow 2 add1 double square) ;; => 36
```

Equivalent to:

```meta-lisp
(double (add1 5))           ;; => 12
(square (double (add1 2)))  ;; => 36
```

## (chain)

```meta-lisp
(chain <step> ...)
```

Pipeline-style function composition.

Unlike `(flow)`, `(chain)` does not take an initial value — it returns a function.

```meta-lisp
(chain add1 double)
(chain add1 double square)
```

Equivalent to:

```meta-lisp
(lambda (x) (flow x add1 double))
(lambda (x) (flow x add1 double square))
```

Equivalent to:

```meta-lisp
(lambda (x) (double (add1 x)))
(lambda (x) (square (double (add1 x))))
```

## (compose)

```meta-lisp
(compose <step> ...)
```

Mathematical function composition.

Composition direction is the reverse of `(chain)`.

```meta-lisp
(compose add1 double)
(compose add1 double square)
```

Equivalent to:

```meta-lisp
(lambda (x) (add1 (double x)))
(lambda (x) (add1 (double (square x))))
```

# Algebraic data types

**Algebraic data types** are the core data type mechanism in meta-lisp.

meta-lisp provides syntax from **explicit** to convenient for defining data types:

| Syntax                      | Purpose                            |
|-----------------------------|------------------------------------|
| `(define-algebraic-type)`   | Multiple constructors, all names explicit |
| `(define-record-type)`      | Single constructor, all names explicit |
| `(define-struct)`           | Single constructor, names generated by convention |
| `(define-enum)`             | Multiple constructors, names generated by convention |

All convenience syntax ultimately expands to `(define-algebraic-type)`.
The most commonly used are `(define-enum)` and `(define-struct)`.

## (define-algebraic-type)

```meta-lisp
(define-algebraic-type <type-name>
  ((<constructor-name> (<field-name> <type>) ...)
   <predicate-name>
   (<field-name> <accessor-name> <modifier-name>)
   ...)
  ...)

(define-algebraic-type (<type-name> <type-parameter> ...)
  ((<constructor-name> (<field-name> <type>) ...)
   <predicate-name>
   (<field-name> <accessor-name> <modifier-name>)
   ...)
  ...)
```

**Algebraic data types** are the core mechanism for building composite data structures.

`(define-algebraic-type)` is the most fundamental form — all names are explicitly specified by the user.

Only `<modifier-name>` is optional.
If omitted, the field reference is immutable.

For example:

```meta-lisp
(define-algebraic-type point-t
  ((make-point (x float-t) (y float-t))
   is-point
   (x point-x point-put-x)
   (y point-y point-put-y)))
```

This generates functions with the following types:

```meta-lisp
(claim make-point (-> float-t float-t point-t))
(claim is-point (-> point-t bool-t))
(claim point-x (-> point-t float-t))
(claim point-y (-> point-t float-t))
(claim point-put-x (-> float-t point-t point-t))
(claim point-put-y (-> float-t point-t point-t))
```

Usage example:

```meta-lisp
(define p (make-point 1.0 2.0))
(is-point p)    ;; => true
(point-x p)     ;; => 1.0
(point-put-x p 3.0)
(point-x p)     ;; => 3.0
```

For single-constructor algebraic types,
the predicate `is-point` is redundant and meaningless.
Predicates are only meaningful when there are multiple constructors.

Types defined with `(define-algebraic-type)` can have type parameters.

For example:

```meta-lisp
(define-algebraic-type (my-list-t E)
  ((nil)
   is-nil)
  ((li (head E) (tail (my-list-t E)))
   is-li
    (head li-head li-put-head)
    (tail li-tail li-put-tail)))
```

This generates functions with the following types:

```meta-lisp
(claim nil (all (E) (-> (my-list-t E))))
(claim is-nil (all (E) (-> (my-list-t E) bool-t)))
(claim li (all (E) (-> E (my-list-t E) (my-list-t E))))
(claim is-li (all (E) (-> (my-list-t E) bool-t)))
(claim li-head (all (E) (-> (my-list-t E) E)))
(claim li-tail (all (E) (-> (my-list-t E) (my-list-t E))))
(claim li-put-head (all (E) (-> E (my-list-t E) (my-list-t E))))
(claim li-put-tail (all (E) (-> (my-list-t E) (my-list-t E) (my-list-t E))))
```

## (define-record-type)

```meta-lisp
(define-record-type <type-name>
  (<constructor-name> (<field-name> <type>) ...)
  <predicate-name>
  (<field-name> <accessor-name> <modifier-name>)
  ...)

(define-record-type (<type-name> <type-parameter> ...)
  (<constructor-name> (<field-name> <type>) ...)
  <predicate-name>
  (<field-name> <accessor-name> <modifier-name>)
  ...)
```

Similar to `(define-algebraic-type)`, but with only one constructor.

```meta-lisp
(define-record-type point-t
  (make-point (x float-t) (y float-t))
  is-point
  (x point-x point-put-x)
  (y point-y point-put-y))
```

Equivalent to:

```meta-lisp
(define-algebraic-type point-t
  ((make-point (x float-t) (y float-t))
   is-point
   (x point-x point-put-x)
   (y point-y point-put-y)))
```

The `(define-record-type)` syntax comes from Scheme,
originating from the Scheme 48 dialect.

We have extended this syntax with type annotations for `<field-name>`,
i.e. `(<field-name> <type>)`.

`(define-algebraic-type)` is modeled after `(define-record-type)`,
extended to support multiple constructors.

## (define-enum)

```meta-lisp
(define-enum <type-name>
  (<constructor-name> (<field-name> <type>) ...)
  ...)

(define-enum (<type-name> <type-parameter> ...)
  (<constructor-name> (<field-name> <type>) ...)
  ...)
```

Defines an algebraic data type with multiple constructors.
Each constructor generates names for a predicate, accessor, and modifier by convention.

```meta-lisp
(define-enum exp-t
  (var-exp (name symbol-t))
  (apply-exp (target exp-t) (arg exp-t))
  (lambda-exp (parameter symbol-t) (body exp-t)))
```

Equivalent to:

```meta-lisp
(define-algebraic-type exp-t
  ((var-exp (name symbol-t))
   is-var-exp
   (name var-exp-name var-exp-put-name))
  ((apply-exp (target exp-t) (arg exp-t))
   is-apply-exp
   (target apply-exp-target apply-exp-put-target)
   (arg apply-exp-arg apply-exp-put-arg))
  ((lambda-exp (parameter symbol-t) (body exp-t))
   is-lambda-exp
   (parameter lambda-exp-parameter lambda-exp-put-parameter)
   (body lambda-exp-body lambda-exp-put-body)))
```

For a given `<constructor-name>`, the naming rules are:

- `<predicate-name>` = `is-<constructor-name>` -- `is-var-exp`
- `<accessor-name>` = `<constructor-name>-<field-name>` -- `var-exp-name`
- `<modifier-name>` = `<constructor-name>-put-<field-name>` -- `var-exp-put-name`

## (define-struct)

```meta-lisp
(define-struct <type-name>
  (<field-name> <type>)
  ...)

(define-struct (<type-name> <type-parameter> ...)
  (<field-name> <type>)
  ...)
```

Defines a single-constructor struct.
`<type-name>` must end with `-t`, in the form `<base-name>-t`.
`<base-name>` is used to generate other names.

```meta-lisp
(define-struct point-t
  (x float-t)
  (y float-t))
```

Equivalent to:

```meta-lisp
(define-algebraic-type point-t
  ((make-point (x float-t) (y float-t))
   is-point
   (x point-x point-put-x)
   (y point-y point-put-y)))
```

For a given `<type-name>`, the naming rules are:

- `<type-name>` = `<base-name>-t` -- `point-t`
- `<predicate-name>` = `is-<base-name>` -- `is-point`
- `<constructor-name>` = `make-<base-name>` -- `make-point`
- `<accessor-name>` = `<base-name>-<field-name>` -- `point-x`
- `<modifier-name>` = `<base-name>-put-<field-name>` -- `point-put-x`

## (match)

```meta-lisp
(match <target>
  (<pattern> <body>)
  ...)
```

Destructures algebraic data types using pattern matching.

```meta-lisp
(define-enum exp-t
  (var-exp (name symbol-t))
  (apply-exp (target exp-t) (arg exp-t))
  (lambda-exp (parameter symbol-t) (body exp-t)))

(define (evaluate exp env)
  (match exp
    ((var-exp name)
     (env-lookup-of-fail name env))
    ((apply-exp target arg)
     (apply (evaluate target env) (evaluate arg env)))
    ((lambda-exp parameter body)
     (closure-value env parameter body))))
```

# Opaque types

## (define-opaque-type)

```meta-lisp
(define-opaque-type <type-name> <representation-type>
  (<interface-name> <interface-type>)
  ...)

(define-opaque-type (<type-name> <type-parameter> ...) <representation-type>
  (<interface-name> <interface-type>)
  ...)
```

Defines an opaque type, hiding its internal representation.

For example, the builtin `box-t` with internal representation `(list-t E)`:

```meta-lisp
(define-opaque-type (box-t E) (list-t E)
  (make-box (-> (box-t E)))
  (box-is-empty (-> (box-t E) bool-t))
  (box-put (-> E (box-t E) (box-t E)))
  (box-get-maybe (-> (box-t E) (maybe-t E))))
```

When implementing interface functions, it is equivalent to declaring:

```meta-lisp
(claim make-box (all (E) (-> (list-t E))))
(claim box-is-empty (all (E) (-> (list-t E) bool-t)))
(claim box-put (all (E) (-> E (list-t E) (list-t E))))
(claim box-get-maybe (all (E) (-> (list-t E) (maybe-t E))))
```

Thus interface functions can use list APIs internally:

```meta-lisp
(define (make-box) (make-list))

(define (box-put value box)
  (if (box-is-empty box)
    (list-push value box)
    (list-put 0 value box)))
```

When using interface functions, it is equivalent to declaring:

```meta-lisp
(claim make-box (all (E) (-> (box-t E))))
(claim box-is-empty (all (E) (-> (box-t E) bool-t)))
(claim box-put (all (E) (-> E (box-t E) (box-t E))))
(claim box-get-maybe (all (E) (-> (box-t E) (maybe-t E))))
```

External code can only operate on `box-t` through interface functions:

```meta-lisp
(claim box-get (all (E) (-> (box-t E) E)))
(define (box-get box)
  (match (box-get-maybe box)
    ((just value) value)
    ((nothing) (error "box is empty"))))
```

# Modules

A folder can be treated as a **package**.
All `.meta` files within the package are considered part of it.

A package can have multiple **modules**.

The module system is decoupled from the file system — the path and filename of a module file do not matter.
Code for the same module can be split across different files.

## (module)

```meta-lisp
(module <module-name>)
```

Declares the current module.

Every `.meta` file must have a module declaration, typically at the top.

Within the same package, names from other modules can be referenced via `<module-name>/<name>`.

Functions in the same module, even if written in different files, can be mutually recursive.

`even.meta`:

```meta-lisp
(module example)

(define (is-even n)
  (if (equal n 0)
    true
    (is-odd (isub n 1))))
```

`odd.meta`:

```meta-lisp
(module example)

(define (is-odd n)
  (if (equal n 0)
    false
    (is-even (isub n 1))))
```

## (import)

```meta-lisp
(import <module-name> <name> ...)
```

Imports specified names from another module.

After importing, names can be used directly without the qualified prefix.

```meta-lisp
(import math pi circumference)
```

After this,

```meta-lisp
math/pi
math/circumference
```

can be abbreviated to:

```meta-lisp
pi
circumference
```

## (import-as)

```meta-lisp
(import-as <module-name> <prefix>)
```

Imports a module with a modified prefix.

`<module-name>/<name>` becomes `<prefix>/<name>`.

```meta-lisp
(import-as meta m)
```

After this,

```meta-lisp
meta/exp-t
```

can be abbreviated to:

```meta-lisp
m/exp-t
```

## (import-all)

```meta-lisp
(import-all <module-name>)
```

Imports all names from a module.

All names become referenceable without a prefix.

If the current module already has a name with the same name,
that name is skipped.

Thus, unqualified references still resolve to the current module's own names.
In other words, local definitions can override names introduced by `(import-all)`.

## (private)

```meta-lisp
(private <name> ...)
```

Marks names as private.

Private names cannot be referenced by other modules.

```meta-lisp
(module serial-number)

(private serial-number-hash)
(define serial-number-hash (make-hash))
```

# Testing

## (define-test)

```meta-lisp
(define-test <test-name> <body>)
```

Defines a test.

`<body>` can contain multiple assertions.

```meta-lisp
(claim add1 (-> int-t int-t))
(define (add1 x) (iadd x 1))

(define-test add1-test
  (assert-equal 2 (add1 1))
  (assert-equal 0 (add1 -1)))
```

The following assertions are supported:

- `(assert x)` -- Asserts `x` is `true`.
- `(assert-not x)` -- Asserts `x` is `false`.
- `(assert-equal lhs rhs)` -- Asserts `lhs` equals `rhs` (using `equal`).
- `(assert-not-equal lhs rhs)` -- Asserts `lhs` does not equal `rhs`.
