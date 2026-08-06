[ [English](README.md) | [中文](README.zh.md) ]

# meta-lisp

A simply typed LISP.

## Features

- Use Hindley-Milner type system (all types can be inferred).
- Support algebraic type and pattern matching (no subtyping).
- Support tail recursion optimization (no need special loop syntax).
- Module system decoupled from the file system.
- Built-in testing framework.

## Examples

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

```scheme
(module example)

(define-enum term-t
  (var-term (name symbol-t))
  (apply-term (target term-t) (arg term-t))
  (lambda-term (parameter symbol-t) (body term-t)))

(define-opaque-type env-t (hash-t symbol-t value-t)
  (empty-env (-> env-t))
  (extend-env (-> symbol-t value-t env-t env-t))
  (env-lookup (-> symbol-t env-t (maybe-t value-t))))

(define empty-env make-hash)
(define extend-env hash-put)
(define env-lookup hash-get-maybe)

(define (evaluate term env)
  (match term
    ((var-term name)
     (match (env-lookup name env)
       ((just value) value)
       ((nothing) (error "undefined name"))))
    ((apply-term target arg)
     (apply (evaluate target env) (evaluate arg env)))
    ((lambda-term parameter body)
     (closure-value env parameter body))))

(define-enum value-t
  (closure-value (env env-t) (parameter symbol-t) (body term-t)))

(define (apply target arg)
  (match target
    ((closure-value env parameter body)
     (evaluate body (extend-env parameter arg env)))))
```

## Documentation

- [Syntax Reference](docs/en/meta-lisp/syntax.md)
- [Builtin Functions](docs/en/meta-lisp/builtin/index.md)
- [FAQ](docs/en/meta-lisp/faq.md)

## License

[GPLv3](LICENSE)
