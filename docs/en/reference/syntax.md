---
title: Syntax
---

meta-lisp uses **S-expression** syntax.

- The module top level consists of **statements**.
- Statements are composed of **expressions**.

All meta-lisp syntax is organized below.

- [Comments](#comments)
- [Literals](#literals)
  - [Atoms](#atoms)
  - [Containers](#containers)
  - [(quote)](#quote)
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
  - [(polymorphic)](#polymorphic)
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
  - [(let*)](#let-1)
  - [(=)](#)
  - [(letrec)](#letrec)
  - [(letrec*)](#letrec-1)
  - [local (define)](#local-define)
- [Function composition](#function-composition)
  - [(pipe)](#pipe)
  - [(chain)](#chain)
  - [(compose)](#compose)
- [Algebraic data types](#algebraic-data-types)
  - [(define-algebraic-type)](#define-algebraic-type)
  - [(define-record-type)](#define-record-type)
  - [(define-enum)](#define-enum)
  - [(define-struct)](#define-struct)
  - [(define-struct*)](#define-struct*)
  - [(match)](#match)
- [Modules](#modules)
  - [(module)](#module)
  - [(import)](#import)
  - [(import-as)](#import-as)
  - [(import-all)](#import-all)
  - [(private)](#private)
- [Testing](#testing)
  - [(define-test)](#define-test)

# Comments

Comments start with `;` and extend to the end of the line.

Lisp programmers typically write two `;;` for line comments.

```scheme
;; This is a comment
(define x 42) ;; end-of-line comment
```

# Literals

## Atoms

Integers consist of digits, with an optional negative sign.

```scheme
42
-1
0
```

Floats have a decimal point.

```scheme
3.14
-2.5
```

Strings are wrapped in double quotes.

```scheme
"hello"
""
```

Symbols start with a single quote followed by a name.

```scheme
'foo
'bar
```

Keywords start with a colon.

```scheme
:key
:name
```

Booleans are `true` and `false` — they are not literals, but variables bound to boolean values.

The void value is `void` — also not a literal, but a variable bound to the void value.

## Containers

`(@list)` creates a list.

```scheme
(@list 1 2 3)
```

The `@` prefix avoids occupying the variable name `list`.

`(@set)` creates a set.

```scheme
(@set 1 2 3)
```

`(@hash)` creates a hash table.

```scheme
(@hash :a 1 :b 2)
(@hash "a" 1 "b" 2)
```

Bracket notation `[...]` is syntactic sugar for `@list`.

```scheme
[1 2 3]
["a" "b" "c"]
```

Equivalent to:

```scheme
(@list 1 2 3)
(@list "a" "b" "c")
```

## (quote)

```scheme
'<exp>
(quote <exp>)
```

Prevents `<exp>` from being evaluated. Typically used to create list data.

```scheme
'(1 2 3)         ;; => [1 2 3]
'(a b c)         ;; => ['a 'b 'c]
'foo             ;; => 'foo
```

Equivalent to:

```scheme
(quote (1 2 3))  ;; => [1 2 3]
(quote (a b c))  ;; => ['a 'b 'c]
(quote foo)      ;; => 'foo
```

# Variables

## (define)

```scheme
(define <name> <exp>)
```

Defines a module-level variable.

```scheme
(define answer 42)
(define greeting "hello")
```

## Variables

A variable references a bound name.

Names consist of letters, digits, `-`, `?`, `!` and other characters.

```scheme
x
factorial
list-length
list-empty?
```

## Qualified variables

`<module-name>/<name>` references a name from another module.

```scheme
builtin/list-length
builtin/list-empty?
```

Qualified names can be used directly without `(import)`.
`(import)` is specifically for removing the `<module-name>` prefix.

# Functions

## Function application

```scheme
(<target> <arg> ...)
```

Function application is the most important syntax.

If the first position of an S-expression is not a syntactic keyword, it is treated as a function application.

The first position is the function, the rest are arguments.

The function expression is evaluated first,
then all argument expressions are evaluated,
then the function is applied.

```scheme
(iadd 1 2)
(println "hello")
((lambda (x) x) 1)
```

When a function is applied with insufficient arguments, partial application (also called **currying**) occurs.

```scheme
((iadd 1) 2)
```

Equivalent to:

```scheme
(iadd 1 2)
```

And `(iadd 1)` can be passed as a value to other functions or returned as a result.

```scheme
(define add1
  (iadd 1))
```

Equivalent to:

```scheme
(define (add1 x)
  (iadd 1 x))
```

## (lambda)

```scheme
(lambda (<parameter> ...)
  <body>)
```

Creates an anonymous function.

`(<parameter> ...)` is the formal parameter list,
`<body>` is one or more expressions.
When the function is applied, actual arguments are bound to the formal parameters, then `<body>` is evaluated.

```scheme
(lambda (x) (iadd x 1))
((lambda (x) (iadd x 1)) 2)  ;; => 3
```

Multiple parameters:

```scheme
(lambda (x y)
  (iadd x y))
```

Equivalent to:

```scheme
(lambda (x)
  (lambda (y)
    (iadd x y)))
```

## (define)

```scheme
(define (<name> <parameter> ...)
  <body>)
```

Defines a function.

Defining a function is equivalent to defining a variable whose value is a lambda.

```scheme
(define (add1 x)
  (iadd 1 x))
```

Equivalent to:

```scheme
(define add1
  (lambda (x)
    (iadd 1 x)))
```

The function body `<body>` can be multiple expressions:

```scheme
(define (f x)
  (= y (iadd x 1))
  (imul y 2))
```

# Types

## Atomic types

| Type        | Description   | Example                        |
|-------------|---------------|--------------------------------|
| `int-t`     | Integer       | `42` `-1`                      |
| `float-t`   | Float         | `3.14` `-2.5`                  |
| `string-t`  | String        | `"hello"`                      |
| `symbol-t`  | Symbol        | `'foo`                         |
| `keyword-t` | Keyword       | `:key`                         |
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

```scheme
(-> <arg-type> ... <ret-type>)
```

Function type.

Takes `<arg-type>` parameters and returns `<ret-type>`.

For example:

```scheme
(-> int-t int-t)
(-> int-t int-t int-t)
(-> string-t bool-t)
```

## (claim)

```scheme
(claim <name> <type>)
```

Declares the type of a name.

The compiler infers the type from `(define)`'s `<body>` and checks it against the `(claim)`.

```scheme
(claim add1 (-> int-t int-t))
(define (add1 x) (iadd x 1))

(claim answer int-t)
(define answer 42)
```

## (admit)

```scheme
(admit <name> <type>)
```

Admits the type of a name.

Similar to `(claim)`, but the compiler does not check the `(define)`'s `<body>`.

```scheme
(admit make-point (-> float-t float-t point-t))
(define (make-point x y)
  (@list 'make-point x y))
```

## (the)

```scheme
(the <type> <exp>)
```

Explicitly annotates `<exp>` with a type.

The compiler checks whether `<exp>`'s actual type matches. Useful for clarifying intent or helping type inference.

```scheme
(the int-t 42)
(the (-> int-t int-t)
  (lambda (x)
    (iadd x 1)))
```

## (polymorphic)

```scheme
(polymorphic (<type-parameter> ...)
  <type>)
```

A type containing type variables.

Type variables are usually single uppercase letters, referenced within `<type>`.
Used in `claim` for polymorphic function signatures.

```scheme
(claim identity (polymorphic (A) (-> A A)))

(claim car (polymorphic (E) (-> (list-t E) E)))
(claim cdr (polymorphic (E) (-> (list-t E) (list-t E))))
(claim cons (polymorphic (E) (-> E (list-t E) (list-t E))))
```

# Conditionals

## (if)

```scheme
(if <condition>
  <consequent>
  <alternative>)
```

Conditional branch.

`<condition>` is evaluated.
If true, `<consequent>` is evaluated and returned.
Otherwise, `<alternative>` is evaluated and returned.

```scheme
(define (abs x)
  (if (int-less? x 0)
    (ineg x)
    x))
```

## (when)

```scheme
(when <condition>
  <body>)
```

Executes when condition is true. Used for side effects.

When `<condition>` is true, `<body>` is evaluated; otherwise skipped.
`<body>` can contain multiple expressions.
A `(when)` expression always returns `void`.

```scheme
(when debug?
  (print "debug mode")
  (newline))
```

## (unless)

```scheme
(unless <condition>
  <body>)
```

Executes when condition is false. Used for side effects.

When `<condition>` is false, `<body>` is evaluated; otherwise skipped.
`<body>` can contain multiple expressions.
An `(unless)` expression always returns `void`.

```scheme
(unless (equal? x 0)
  (print (idiv 1 x))
  (newline))
```

## (cond)

```scheme
(cond
  (<question> <answer>)
  ...)
```

Multi-branch conditional.

Each `<question>` is evaluated in order.
The `<answer>` of the first true branch is evaluated and returned.
The last `<question>` can be `else` as the default branch.

```scheme
(define (classify x)
  (cond
   ((int-positive? x) "positive")
   ((int-negative? x) "negative")
   (else "zero")))
```

## (and)

```scheme
(and <exp> ...)
```

Short-circuit and.

Evaluates left to right. Stops and returns the value at the first false. Returns the last value if all are true.

```scheme
(and (int? x) (int-positive? x))
```

Returns `true` with zero arguments.

## (or)

```scheme
(or <exp> ...)
```

Short-circuit or.

Evaluates left to right. Stops and returns the value at the first true. Returns the last value if all are false.

```scheme
(or (equal? x 0) (equal? x 1))
```

Returns `false` with zero arguments.

# Sequencing and bindings

## (begin)

```scheme
(begin <body>)
```

Sequential execution.

`<body>` can be multiple expressions `<exp> ...`,
evaluated in order. Returns the value of the last expression.
Earlier expressions are typically for side effects.

```scheme
(begin
  (println "step 1")
  (println "step 2")
  42)  ;; => 42
```

The `<body>` of `(lambda)` and `(define)` function bodies both work like `(begin)`'s `<body>`.

```scheme
(define (f x)
  (= y (iadd x 1))
  (imul y 2))
```

## (let)

```scheme
(let ((<name> <exp>)
      ...)
  <body>)
```

Parallel local variable bindings.

All right-hand side `<exp>`s are evaluated in the same outer scope, invisible to each other.
Then all `<name>`s are simultaneously bound to the results, and `<body>` is evaluated.

```scheme
(let ((x 1))
  (iadd x 1))  ;; => 2

(let ((x 1)
      (y 2))
  (iadd x y))  ;; => 3
```

Parallel means later bindings cannot refer to earlier ones:

```scheme
(let ((x 1)
      (y (iadd x 1)))  ;; Error: x not visible on the right side
  (iadd x y))
```

## (let*)

```scheme
(let* ((<name> <exp>)
       ...)
  <body>)
```

Sequential local variable bindings.

Each `<exp>` can reference previously bound names.

```scheme
(let* ((x 1)
       (y (iadd x 1)))
  (iadd x y))  ;; => 3
```

`(let*)` is equivalent to nested `(let)`:

```scheme
(let ((x 1))
  (let ((y (iadd x 1)))
    (iadd x y)))
```

## (=)

```scheme
(= <name> <exp>)
```

Local variable binding in `<body>`.

Can only be used inside a `<body>`.
Replaces nested `(let)` to reduce indentation.

```scheme
(define (f x)
  (= y (iadd x 1))
  (println y)
  (= z (iadd y 1))
  (println z)
  (iadd y z))
```

Equivalent to:

```scheme
(define (f x)
  (let ((y (iadd x 1)))
    (println y)
    (let ((z (iadd y 1)))
      (println z)
      (iadd y z))))
```

## (letrec)

```scheme
(letrec ((<name> <exp>)
         ...)
  <body>)
```

Similar to `(let)`, but supports recursion and mutual recursion.

All `<exp>`s are evaluated in the same scope, invisible to each other.
All `<name>`s are simultaneously bound to the results, then `<body>` is evaluated.

Mutual recursion:

```scheme
(letrec ((even?
          (lambda (n)
            (if (equal? n 0)
              true
              (odd? (isub n 1)))))
         (odd?
          (lambda (n)
            (if (equal? n 0)
              false
              (even? (isub n 1))))))
  (assert (even? 4)))
```

Difference from `(letrec*)` (see below):

```scheme
;; (letrec*) supports sequential dependency:
(letrec* ((a 1)
          (b (iadd a 1)))
  b)  ;; => 2

;; (letrec) parallel semantics — no sequential dependency:
(letrec ((a 1)
         (b (iadd a 1)))  ;; Error: a not visible here
  b)
```


## (letrec*)

```scheme
(letrec* ((<name> <exp>)
          ...)
  <body>)
```

Similar to `(let*)`, but supports recursion and mutual recursion.

All `<exp>`s can reference all `<name>`s.

Mutual recursion:

```scheme
(letrec* ((even?
           (lambda (n)
             (if (equal? n 0)
               true
               (odd? (isub n 1)))))
          (odd?
           (lambda (n)
             (if (equal? n 0)
               false
               (even? (isub n 1))))))
  (assert (even? 4)))
```

Sequential dependency:

```scheme
(letrec* ((a 1)
          (b (iadd a 1)))
  b)  ;; => 2
```

## local (define)

```scheme
(define (<name> <parameter> ...) <body>)
(define <name> <exp>)
```

Local recursive variable bindings in `<body>`.

Allows `(define)` inside `<body>`.
Replaces nested `(letrec*)` to reduce indentation.

Mutual recursion (equivalent to the `(letrec*)` example above):

```scheme
(begin
  (define (even? n)
    (if (equal? n 0)
      true
      (odd? (isub n 1))))
  (define (odd? n)
    (if (equal? n 0)
      false
      (even? (isub n 1))))
  (even? 4))
```

Sequential dependency:

```scheme
(begin
  (define a 1)
  (define b (iadd a 1))
  b)  ;; => 2
```

`(=)` and `(define)` can be mixed:

```scheme
(begin
  (= one 1)
  (define a one)
  (define b (iadd a one))
  b)  ;; => 2
```


# Function composition

## (pipe)

```scheme
(pipe <init> <step> ...)
```

Pipeline.

Passes `<init>` to the first `<step>`, the result to the second `<step>`, and so on.

```scheme
(pipe 5 add1 double)        ;; => 12
(pipe 2 add1 double square) ;; => 36
```

Equivalent to:

```scheme
(double (add1 5))           ;; => 12
(square (double (add1 2)))  ;;  => 36
```

## (chain)

```scheme
(chain <step> ...)
```

Pipeline-style function composition.

Unlike `(pipe)`, `(chain)` does not take an initial value — it returns a function.

```scheme
(chain add1 double)
(chain add1 double square)
```

Equivalent to:

```scheme
(lambda (x) (pipe x add1 double))
(lambda (x) (pipe x add1 double square))
```

Equivalent to:

```scheme
(lambda (x) (double (add1 x)))
(lambda (x) (square (double (add1 x))))
```

## (compose)

```scheme
(compose <step> ...)
```

Mathematical function composition.

Composition direction is the reverse of `(chain)`.

```scheme
(compose add1 double)
(compose add1 double square)
```

Equivalent to:

```scheme
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
| `(define-struct*)`          | Single constructor, constructor name explicit |
| `(define-struct)`           | Single constructor, names generated by convention |
| `(define-enum)`             | Multiple constructors, names generated by convention |

All convenience syntax ultimately expands to `(define-algebraic-type)`.
The most commonly used are `(define-enum)` and `(define-struct)`.

## (define-algebraic-type)

```scheme
(define-algebraic-type <type-name>
  ((<constructor-name> (<field-name> <type>) ...)
   <predicate-name>
   (<field-name> <accessor-name> <modifier-name>)
   ...)
  ...)
```

Or with type parameters:

```scheme
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

```scheme
(define-algebraic-type point-t
  ((make-point (x float-t) (y float-t))
   point?
   (x point-x point-put-x!)
   (y point-y point-put-y!)))
```

This generates functions with the following types:

```scheme
(claim make-point (-> float-t float-t point-t))
(claim point? (-> point-t bool-t))
(claim point-x (-> point-t float-t))
(claim point-y (-> point-t float-t))
(claim point-put-x! (-> float-t point-t point-t))
(claim point-put-y! (-> float-t point-t point-t))
```

Usage example:

```scheme
(define p (make-point 1.0 2.0))
(point? p)      ;; => true
(point-x p)     ;; => 1.0
(point-put-x! p 3.0)
(point-x p)     ;; => 3.0
```

For single-constructor algebraic types,
the predicate `point?` is redundant and meaningless.
Predicates are only meaningful when there are multiple constructors.

Types defined with `(define-algebraic-type)` can have type parameters.

For example:

```scheme
(define-algebraic-type (my-list-t E)
  ((nil)
   nil?)
  ((li (head E) (tail (my-list-t E)))
   li?
   (head li-head li-put-head!)
   (tail li-tail li-put-tail!)))
```

This generates functions with the following types:

```scheme
(claim nil (polymorphic (E) (-> (my-list-t E))))
(claim nil? (polymorphic (E) (-> (my-list-t E) bool-t)))
(claim li (polymorphic (E) (-> E (my-list-t E) (my-list-t E))))
(claim li? (polymorphic (E) (-> (my-list-t E) bool-t)))
(claim li-head (polymorphic (E) (-> (my-list-t E) E)))
(claim li-tail (polymorphic (E) (-> (my-list-t E) (my-list-t E))))
(claim li-put-head! (polymorphic (E) (-> E (my-list-t E) (my-list-t E))))
(claim li-put-tail! (polymorphic (E) (-> (my-list-t E) (my-list-t E) (my-list-t E))))
```

## (define-record-type)

```scheme
(define-record-type <type-name>
  (<constructor-name> (<field-name> <type>) ...)
  <predicate-name>
  (<field-name> <accessor-name> <modifier-name>)
  ...)
```

Or with type parameters:

```scheme
(define-record-type (<type-name> <type-parameter> ...)
  (<constructor-name> (<field-name> <type>) ...)
  <predicate-name>
  (<field-name> <accessor-name> <modifier-name>)
  ...)
```

Similar to `(define-algebraic-type)`, but with only one constructor.

```scheme
(define-record-type point-t
  (make-point (x float-t) (y float-t))
  point?
  (x point-x point-put-x!)
  (y point-y point-put-y!))
```

Equivalent to:

```scheme
(define-algebraic-type point-t
  ((make-point (x float-t) (y float-t))
   point?
   (x point-x point-put-x!)
   (y point-y point-put-y!)))
```

The `(define-record-type)` syntax comes from Scheme,
originating from the Scheme 48 dialect.

We have extended this syntax with type annotations for `<field-name>`,
i.e. `(<field-name> <type>)`.

`(define-algebraic-type)` is modeled after `(define-record-type)`,
extended to support multiple constructors.

## (define-enum)

```scheme
(define-enum <type-name>
  (<constructor-name> (<field-name> <type>) ...)
  ...)
```

Or with type parameters:

```scheme
(define-enum (<type-name> <type-parameter> ...)
  (<constructor-name> (<field-name> <type>) ...)
  ...)
```

Defines an algebraic data type with multiple constructors.
Each constructor generates names for a predicate, accessor, and modifier by convention.

```scheme
(define-enum exp-t
  (var-exp (name symbol-t))
  (apply-exp (target exp-t) (arg exp-t))
  (lambda-exp (parameter symbol-t) (body exp-t)))
```

Equivalent to:

```scheme
(define-algebraic-type exp-t
  ((var-exp (name symbol-t))
   var-exp?
   (name var-exp-name var-exp-put-name!))
  ((apply-exp (target exp-t) (arg exp-t))
   apply-exp?
   (target apply-exp-target apply-exp-put-target!)
   (arg apply-exp-arg apply-exp-put-arg!))
  ((lambda-exp (parameter symbol-t) (body exp-t))
   lambda-exp?
   (parameter lambda-exp-parameter lambda-exp-put-parameter!)
   (body lambda-exp-body lambda-exp-put-body!)))
```

For a given `<constructor-name>`, the naming rules are:

- `<predicate-name>` = `<constructor-name>?` -- `var-exp?`
- `<accessor-name>` = `<constructor-name>-<field-name>` -- `var-exp-name`
- `<modifier-name>` = `<constructor-name>-put-<field-name>!` -- `var-exp-put-name!`

## (define-struct)

```scheme
(define-struct <type-name>
  (<field-name> <type>)
  ...)
```

Or with type parameters:

```scheme
(define-struct (<type-name> <type-parameter> ...)
  (<field-name> <type>)
  ...)
```

Defines a single-constructor struct.
`<type-name>` must end with `-t`, in the form `<base-name>-t`.
`<base-name>` is used to generate other names.

```scheme
(define-struct point-t
  (x float-t)
  (y float-t))
```

Equivalent to:

```scheme
(define-algebraic-type point-t
  ((make-point (x float-t) (y float-t))
   point?
   (x point-x point-put-x!)
   (y point-y point-put-y!)))
```

For a given `<type-name>`, the naming rules are:

- `<type-name>` = `<base-name>-t` -- `point-t`
- `<predicate-name>` = `<base-name>?` -- `point?`
- `<constructor-name>` = `make-<base-name>` -- `make-point`
- `<accessor-name>` = `<base-name>-<field-name>` -- `point-x`
- `<modifier-name>` = `<base-name>-put-<field-name>!` -- `point-put-x!`

## (define-struct*)

```scheme
(define-struct* <type-name>
  (<constructor-name>
   (<field-name> <type>)
   ...))
```

Or with type parameters:

```scheme
(define-struct* (<type-name> <type-parameter> ...)
  (<constructor-name>
   (<field-name> <type>)
   ...))
```

Similar to `(define-struct)`, but `<constructor-name>` is given by the user.

```scheme
(define-struct* point-t
  (make-point
   (x float-t)
   (y float-t)))
```

Equivalent to:

```scheme
(define-struct point-t
  (x float-t)
  (y float-t))
```

This variant of `(define-struct)` exists because sometimes `make-<base-name>` needs to be reserved for a simpler constructor.

```scheme
(define-struct* project-t
  (cons-project
   (root-directory string-t)
   (config project-config-t)
   (fragments (hash-t string-t mod-fragment-t))))

(define (make-project root-directory config)
  (cons-project root-directory config (make-hash)))
```

## (match)

```scheme
(match <target>
  (<pattern> <body>)
  ...)
```

Destructures algebraic data types using pattern matching.

```scheme
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

# Modules

A folder can be treated as a **project**.
All `.meta` files within the project are considered part of it.

A project can have multiple **modules**.

The module system is decoupled from the file system — the path and filename of a module file do not matter.
Code for the same module can be split across different files.

## (module)

```scheme
(module <module-name>)
```

Declares the current module.

Every `.meta` file must have a module declaration, typically at the top.

Within the same project, names from other modules can be referenced via `<module-name>/<name>`.

Functions in the same module, even if written in different files, can be mutually recursive.

`even.meta`:

```scheme
(module example)

(define (even? n)
  (if (equal? n 0)
    true
    (odd? (isub n 1))))
```

`odd.meta`:

```scheme
(module example)

(define (odd? n)
  (if (equal? n 0)
    false
    (even? (isub n 1))))
```

## (import)

```scheme
(import <module-name> <name> ...)
```

Imports specified names from another module.

After importing, names can be used directly without the qualified prefix.

```scheme
(import math pi circumference)
```

After this,

```scheme
math/pi
math/circumference
```

can be abbreviated to:

```scheme
pi
circumference
```

## (import-as)

```scheme
(import-as <module-name> <prefix>)
```

Imports a module with a modified prefix.

`<module-name>/<name>` becomes `<prefix>/<name>`.

```scheme
(import-as meta m)
```

After this,

```scheme
meta/exp-t
```

can be abbreviated to:

```scheme
m/exp-t
```

## (import-all)

```scheme
(import-all <module-name>)
```

Imports all names from a module.

All names become referenceable without a prefix.

If the current module already has a name with the same name,
that name is skipped.

Thus, unqualified references still resolve to the current module's own names.
In other words, local definitions can override names introduced by `(import-all)`.

## (private)

```scheme
(private <name> ...)
```

Marks names as private.

Private names cannot be referenced by other modules.

```scheme
(module serial-number)

(private serial-number-hash)
(define serial-number-hash (make-hash))
```

# Testing

## (define-test)

```scheme
(define-test <test-name> <body>)
```

Defines a test.

`<body>` can contain multiple assertions.

```scheme
(claim add1 (-> int-t int-t))
(define (add1 x) (iadd x 1))

(define-test add1-test
  (assert-equal 2 (add1 1))
  (assert-equal 0 (add1 -1)))
```

The following assertions are supported:

- `(assert x)` -- Asserts `x` is `true`.
- `(assert-not x)` -- Asserts `x` is `false`.
- `(assert-equal lhs rhs)` -- Asserts `lhs` equals `rhs` (using `equal?`).
- `(assert-not-equal lhs rhs)` -- Asserts `lhs` does not equal `rhs`.
