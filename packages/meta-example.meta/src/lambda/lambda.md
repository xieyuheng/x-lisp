---
title: lambda calculus interpreter
---

# interpreter

The aim of an interpreter is to evaluate term to value in a given environment.

```meta-lisp
(module lambda)

(claim evaluate (-> term-t env-t value-t))
```

# term and value

The term of lambda calculus has:

- **variable**: `(var-term name)` — a name that is looked up in the current environment.
- **function application**: `(apply-term target arg)` — evaluates `target` to a value; if the value is a closure, applies it to `arg`.
- **lambda abstraction**: `(lambda-term parameter body)` — captures the current environment and produces a closure.
- **let**: `(let-term name rhs body)` — evaluates `rhs`, extends the environment with `name`, then evaluates `body`.

```meta-lisp
(module lambda)

(define-enum term-t
  (var-term (name symbol-t))
  (apply-term (target term-t) (arg term-t))
  (lambda-term (parameter symbol-t) (body term-t))
  (let-term (name symbol-t) (rhs term-t) (body term-t)))
```

The value of lambda calculus can only be closure.

```meta-lisp
(module lambda)

(define-enum value-t
  (closure-value (env env-t) (parameter symbol-t) (body term-t)))
```

Environment is a key-value map from name to value.

```meta-lisp
(module lambda)

(define-opaque-type env-t (hash-t symbol-t value-t)
  (empty-env (-> env-t))
  (extend-env (-> env-t symbol-t value-t env-t))
  (env-lookup (-> env-t symbol-t (maybe-t value-t))))

(define empty-env make-hash)
(define extend-env hash-copy-put)
(define env-lookup hash-get-maybe)
```

# evaluate

The evaluate function can be defined with the help of apply.

```meta-lisp
(module lambda)

(define (evaluate term env)
  (match term
    ((var-term name)
     (match (env-lookup env name)
       ((just value) value)
       ((nothing) (error "undefined name"))))
    ((apply-term target arg)
     (apply (evaluate target env) (evaluate arg env)))
    ((lambda-term parameter body)
     (closure-value env parameter body))
    ((let-term name rhs body)
     (let ((env (extend-env env name (evaluate rhs env))))
       (evaluate body env)))))

(define (apply target arg)
  (match target
    ((closure-value env parameter body)
     (evaluate body (extend-env env parameter arg)))))
```

# test

```meta-lisp
(module lambda)

(define (evaluate-and-print term)
  (println (evaluate term (empty-env))))

(define-test lambda-interpreter-test
  (evaluate-and-print
    (lambda-term 'x (var-term 'x)))

  (evaluate-and-print
    (apply-term
      (lambda-term 'x (var-term 'x))
      (lambda-term 'x (var-term 'x))))

  (evaluate-and-print
    (apply-term
      (apply-term
        (lambda-term 'x (var-term 'x))
        (lambda-term 'x (var-term 'x)))
      (apply-term
        (lambda-term 'x (var-term 'x))
        (lambda-term 'x (var-term 'x)))))

  (evaluate-and-print
    (let-term
      'id (lambda-term 'x (var-term 'x))
      (var-term 'id)))

  (evaluate-and-print
    (let-term
      'id (lambda-term 'x (var-term 'x))
      (apply-term (var-term 'id) (var-term 'id))))

  (evaluate-and-print
    (let-term
      'id (lambda-term 'x (var-term 'x))
      (apply-term
        (apply-term (var-term 'id) (var-term 'id))
        (apply-term (var-term 'id) (var-term 'id))))))
```
