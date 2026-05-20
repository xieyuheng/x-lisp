# meta-lisp

A simply typed lisp for implementing new lisp languages.

## Features

- Hindley-Milner type system (all types can be inferred).
- Algebraic data types and pattern matching (no subtyping and no OOP).
- Tail recursion optimization (no need `for`/`while` loop syntax).
- Module system decoupled from the file system.
- Built-in testing framework.

## Examples

```scheme
(module example)

;; use (define-enum) to define algebraic data type:

(define-enum exp-t
  (var-exp (name symbol-t))
  (apply-exp (target exp-t) (arg exp-t))
  (lambda-exp (parameter symbol-t) (body exp-t)))

;; use (define-opaque-type) to define new type without wrapper:

(define-opaque-type env-t (hash-t symbol-t value-t)
  (empty-env (-> env-t))
  (extend-env (-> symbol-t value-t env-t env-t))
  (env-lookup (-> symbol-t env-t (maybe-t value-t))))

(define empty-env make-hash)
(define extend-env hash-put)
(define env-lookup hash-get-maybe)

;; pattern matching on algebraic data:

(define (evaluate exp env)
  (match exp
    ((var-exp name)
     (match (env-lookup name env)
       ((just value) value)
       ((nothing) (error "undefined name"))))
    ((apply-exp target arg)
     (apply (evaluate target env) (evaluate arg env)))
    ((lambda-exp parameter body)
     (closure-value env parameter body))))

(define-enum value-t
  (closure-value (env env-t) (parameter symbol-t) (body exp-t)))

(define (apply target arg)
  (match target
    ((closure-value env parameter body)
     (evaluate body (extend-env parameter arg env)))))
```

```scheme
(module example)

(claim factorial (-> int-t int-t))

(define (factorial n)
  (if (int-less-or-equal? n 1)
    1
    (imul (factorial (isub n 1)) n)))

;; builtin test framework:

(define-test factorial-test
  (assert-equal 1 (factorial 0))
  (assert-equal 1 (factorial 1))
  (assert-equal 2 (factorial 2))
  (assert-equal 6 (factorial 3))
  (assert-equal 24 (factorial 4))
  (assert-equal 120 (factorial 5)))
```

## Documentation

- [Syntax Reference](docs/en/reference/syntax.md) ([中文](docs/zh/reference/syntax.md))
- [Builtin Functions](docs/en/reference/builtin/index.md) ([中文](docs/zh/reference/builtin/index.md))
- [FAQ](docs/en/faq/faq.md) ([中文](docs/zh/faq/faq.md))

## License

[GPLv3](LICENSE)
