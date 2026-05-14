# meta-lisp

A statically typed lisp for implementing new lisp languages.

meta-lisp is a statically typed lisp dialect following Scheme's minimalist syntax design.

## Example

```scheme
(module example)

(claim factorial (-> int-t int-t))

(define (factorial n)
  (if (int-less-or-equal? n 1)
    1
    (imul (factorial (isub n 1)) n)))

(define-test factorial-test
  (assert-equal 1 (factorial 0))
  (assert-equal 1 (factorial 1))
  (assert-equal 2 (factorial 2))
  (assert-equal 6 (factorial 3))
  (assert-equal 24 (factorial 4))
  (assert-equal 120 (factorial 5)))
```

## Features

- Hindley-Milner type system.
- No subtyping — traditional OOP is not supported.
- Tail recursion optimization (no `for`/`while` loop syntax).
- Algebraic data types and pattern matching.
- Module system decoupled from the file system.
- Built-in testing framework.

## Syntax Design

Improvements over Scheme:

- Use `[@list 1 2 3]` instead of `(list 1 2 3)` to avoid occupying `list` as a variable name.
- Avoid single-character function names like `*`, `+`, `-`.
- Use `(= <name> <exp>)` to avoid nested `(let)` in function bodies with multiple expressions.
- Add type annotations for fields in `(define-record-type)`.
- Add `(define-algebraic-type)` syntax.

## License

[GPLv3](LICENSE)
