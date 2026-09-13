---
module: markdown
---

```meta-lisp
(define (square x) (imul x x))
```

```meta-lisp
(define-test square-test
  (assert-equal 9 (square 3)))
```
