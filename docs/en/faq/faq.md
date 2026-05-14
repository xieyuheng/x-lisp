---
title: Frequently Asked Questions (FAQ)
---

# Does meta-lisp have for/while loops?

No. Use **tail-recursive functions** instead:

```scheme
(define (list-sum xs)
  (list-sum-loop xs 0))

(define (list-sum-loop remaining result)
  (match remaining
    ((nil) result)
    ((li head tail) (list-sum-loop tail (iadd result head)))))
```

The compiler handles tail calls correctly — no stack growth.

# How to compare two values?

```scheme
(equal? a b)     ;; structural equality
(same? a b)      ;; reference equality, or same for atomic data
```

# How to print debug info?

```scheme
(print x)        ;; print a value
(println x)      ;; print a value and newline
(write s)        ;; print a string
(writeln s)      ;; print a string and newline
(newline)        ;; print a newline
(format x)       ;; format a value as a string
```

# Differences from Scheme?

meta-lisp follows Scheme's minimalist syntax philosophy, but they are completely different languages.

Many syntax improvements over Scheme. Not an implementation of Scheme's standard, not a Scheme dialect.

The most important difference: meta-lisp is statically typed, while Scheme is dynamically typed.

# What is the type system like?

meta-lisp has a Hindley-Milner type system similar to Haskell and ML.

A very simple type system:

- No subtyping.
- No row polymorphism.
- No union or intersection types.
- No typeclasses.

# Differences from Haskell?

| Haskell                            | meta-lisp                                              |
|------------------------------------|--------------------------------------------------------|
| `Int -> Int`                       | `(-> int-t int-t)`                                     |
| `forall a. a -> a`                 | `(polymorphic (A) (-> A A))`                           |
| Typeclasses                        | ❌ Not supported                                        |
| `data Maybe a = Nothing \| Just a` | `(define-enum (maybe-t A) (just (value A)) (nothing))` |
| Algebraic data types               | ✅ `define-enum`                                       |
| Pattern matching                   | ✅ `match`                                             |
| Lazy evaluation                    | ❌ Strict evaluation (call-by-value)                   |
| Purely functional (no side effects)| ❌ Side effects allowed (I/O, printing)                |

# Differences from SML?

| SML                                       | meta-lisp                                            |
|-------------------------------------------|------------------------------------------------------|
| `int -> int`                              | `(-> int-t int-t)`                                   |
| `'a -> 'a`                                | `(polymorphic (A) (-> A A))`                         |
| Functors                                  | ❌ Not supported                                      |
| `datatype 'a option = NONE \| SOME of 'a` | `(define-enum (option-t A) (some (value A)) (none))` |
| Pattern matching (`case`)                 | ✅ `match`                                           |
| Strict evaluation                         | ✅ Strict evaluation (call-by-value)                 |
| Side effects allowed                      | ✅ Side effects allowed (I/O, printing)              |

# Differences from OCaml?

| OCaml                                 | meta-lisp                                            |
|---------------------------------------|------------------------------------------------------|
| `int -> int`                          | `(-> int-t int-t)`                                   |
| `'a -> 'a`                            | `(polymorphic (A) (-> A A))`                         |
| Module system (Module / Functor)      | ❌ Not supported                                      |
| `type 'a option = None \| Some of 'a` | `(define-enum (option-t A) (some (value A)) (none))` |
| Pattern matching (`match`)            | ✅ `match`                                           |
| Strict evaluation                     | ✅ Strict evaluation (call-by-value)                 |
| Side effects allowed                  | ✅ Side effects allowed (I/O, printing)              |

# Differences from TypeScript?

| TypeScript                    | meta-lisp                  |
|-------------------------------|----------------------------|
| Union types                  | ❌ Not supported            |
| Intersection types           | ❌ Not supported            |
| Subtyping (interface extends)| ❌ Not supported            |
| Generics `<T>`               | ✅ `(polymorphic (A) ...)` |
| `any` / `unknown`            | ❌ Not supported            |
| Structural typing            | ❌ Nominal typing only     |

# How to specify a custom constructor name for (define-struct)?

`(define-struct)` generates the constructor name as `make-<base-name>`:

```scheme
(define-struct point-t
  (x int-t)
  (y int-t))
```

Use `(define-struct*)` to specify a custom constructor name:

```scheme
(define-struct* point-t
  (cons-point
   (x int-t)
   (y int-t)))
```

# Why must type names end with `-t`?

This is a naming convention.

`(define-struct)` uses the type name `<base-name>-t` to generate the constructor name `make-<base-name>`.
For example, `point-t` → `make-point`.

If you don't want this convention,
use the more explicit `(define-struct*)` or `(define-record-type)`.
