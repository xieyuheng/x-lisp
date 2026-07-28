---
title: triple-t
---

# Type

```meta-lisp
type-t
```

# Description

Triple type constructor. `(triple-t A B C)` represents a triple containing values of types `A`, `B` and `C`.

# Definition

```meta-lisp
(define-struct (triple-t A B C)
  (first A)
  (second B)
  (third C))
```

# Generated

```meta-lisp
(claim make-triple (polymorphic (A B C) (-> A B C (triple-t A B C))))
(claim is-triple (polymorphic (A) (-> A bool-t)))
(claim triple-first  (polymorphic (A B C) (-> (triple-t A B C) A)))
(claim triple-second (polymorphic (A B C) (-> (triple-t A B C) B)))
(claim triple-third  (polymorphic (A B C) (-> (triple-t A B C) C)))
(claim triple-put-first!  (polymorphic (A B C) (-> A (triple-t A B C) (triple-t A B C))))
(claim triple-put-second! (polymorphic (A B C) (-> B (triple-t A B C) (triple-t A B C))))
(claim triple-put-third!  (polymorphic (A B C) (-> C (triple-t A B C) (triple-t A B C))))
```

# Examples

```meta-lisp
(let ((t (make-triple 1 "hello" #t)))
  (triple-first t))   ;; => 1
```
