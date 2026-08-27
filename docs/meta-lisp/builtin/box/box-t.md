---
title: box-t
---

# Type

```meta-lisp
type-t
```

# Description

Box type constructor. Internally represented as `(list-t E)`.

# Definition

```meta-lisp
(define-opaque-type (box-t E) (list-t E)
  (make-box (-> (box-t E)))
  (box-is-empty (-> (box-t E) bool-t))
  (box-put (-> E (box-t E) (box-t E)))
  (box-get-maybe (-> (box-t E) (maybe-t E))))
```

# Generated

```meta-lisp
(claim make-box (all (E) (-> (box-t E))))
(claim box-is-empty (all (E) (-> (box-t E) bool-t)))
(claim box-put (all (E) (-> E (box-t E) (box-t E))))
(claim box-get-maybe (all (E) (-> (box-t E) (maybe-t E))))
(claim box-get (all (E) (-> (box-t E) E)))
```

# Examples

```meta-lisp
(define box (make-box))
(box-is-empty box)    ;; => true
(box-put 42 box)
(box-is-empty box)    ;; => false
(box-get-maybe box) ;; => (just 42)
(box-get box)       ;; => 42
```
