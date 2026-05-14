# local (define)


[meta-lisp.js] 新增 `LocalDefine` `Exp`

---

[plan] [meta-lisp.js] 新增 `LocalDefine` `Exp`

- 结构与作为 `Stmt` 的 `Define` 一致。
- 语法与作为 `Stmt` 的 `(define)` 一致。
- 在 `desugarBegin` 中将 <body> 中出现的相邻的 local (define) 收集起来，
  转化为 (letrec*)，例如：

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
  body)
```

转化为：

```scheme
(begin
  (letrec*
      ((even?
        (lambda (n)
          (if (equal? n 0)
            true
            (odd? (isub n 1)))))
       (odd?
        (lambda (n)
          (if (equal? n 0)
            false
            (even? (isub n 1))))))
    body))
```

---

[meta-lisp.js] fix the problem of letrec-sequential-binding-error.meta

- 要么就放弃 letrec 这个语法。
- 要么给出更好的运行时报错。

# setup feedback loop

[meta-lisp.meta] remove `env` `evaluate` and `value`
[meta-lisp.meta] `expand-pass`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] fix error report -- maybe need `buffer-t`
