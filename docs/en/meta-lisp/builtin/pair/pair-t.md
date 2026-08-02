---
title: pair-t
---

# Type

```meta-lisp
type-t
```

# Description

Pair type constructor. `(pair-t A B)` represents a pair containing values of types `A` and `B`.

# Definition

```meta-lisp
(define-struct (pair-t A B)
  (first A)
  (second B))
```

# Generated

```meta-lisp
(claim make-pair (polymorphic (A B) (-> A B (pair-t A B))))
(claim is-pair (polymorphic (A) (-> A bool-t)))
(claim pair-first  (polymorphic (A B) (-> (pair-t A B) A)))
(claim pair-second (polymorphic (A B) (-> (pair-t A B) B)))
(claim pair-put-first  (polymorphic (A B) (-> A (pair-t A B) (pair-t A B))))
(claim pair-put-second (polymorphic (A B) (-> B (pair-t A B) (pair-t A B))))
```

# Examples

```meta-lisp
(let ((p (make-pair 1 "hello")))
  (pair-first p))   ;; => 1
```
