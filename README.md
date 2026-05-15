# meta-lisp

> A statically typed lisp for implementing new lisp languages.

meta-lisp is a statically typed lisp dialect
following Scheme's minimalist syntax design.

## Documentation

- [Syntax Reference](docs/en/reference/syntax.md) ([中文](docs/zh/reference/syntax.md))
- [Builtin Functions](docs/en/reference/builtin/index.md) ([中文](docs/zh/reference/builtin/index.md))
- [FAQ](docs/en/faq/faq.md) ([中文](docs/zh/faq/faq.md))

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
- Algebraic data types and pattern matching (No subtyping and no OOP).
- Tail recursion optimization (no need `for`/`while` loop syntax).
- Module system decoupled from the file system.
- Built-in testing framework.

## License

[GPLv3](LICENSE)
