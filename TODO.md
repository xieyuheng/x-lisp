# (define-opaque-type)

[meta-lisp.js] `(define-abstract-type)` or `(define-opaque-type)`

如何设计一种 define-abstract-type 或 define-opaque-type 语法，
使得下面的 (box-t E) 类型定义为 (list-t E)，
但是在类型检查的时候可以和可以和 (list-t E) 区分开。

```scheme
(define-type (box-t E) (list-t E))

(claim make-box (polymorphic (E) (-> (box-t E))))
(define (make-box)
  (make-list))

(claim box-empty? (polymorphic (E) (-> (box-t E) bool-t)))
(define (box-empty? box)
  (list-empty? box))

(claim box-put! (polymorphic (E) (-> E (box-t E) (box-t E))))
(define (box-put! value box)
  (if (box-empty? box)
    (list-push! value box)
    (list-put! 0 value box)))

(claim box-get-maybe (polymorphic (E) (-> (box-t E) (maybe-t E))))
(define (box-get-maybe box)
  (if (box-empty? box)
    (nothing)
    (just (car box))))
```

# setup feedback loop

[meta-lisp.meta] remove `env` `evaluate` and `value`
[meta-lisp.meta] `expand-pass`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] fix error report -- maybe need `buffer-t`
