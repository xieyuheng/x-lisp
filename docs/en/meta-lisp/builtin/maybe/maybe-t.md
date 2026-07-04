---
title: maybe-t
---

# Type

```meta-lisp
type-t
```

# Description

Maybe type constructor. `(maybe-t A)` represents a value of type `A` that may or may not exist.

# Definition

```meta-lisp
(define-enum (maybe-t A)
  (just (value A))
  (nothing))
```

# Generated

```meta-lisp
(claim just  (polymorphic (A) (-> A (maybe-t A))))
(claim just? (polymorphic (A) (-> (maybe-t A) bool-t)))
(claim just-value (polymorphic (A) (-> (maybe-t A) A)))
(claim just-put-value! (polymorphic (A) (-> A (maybe-t A) (maybe-t A))))

(claim nothing (polymorphic (A) (-> (maybe-t A))))
(claim nothing? (polymorphic (A) (-> (maybe-t A) bool-t)))
```

# Examples

```meta-lisp
(define x (just 42))
(just? x)          ;; => true
(nothing? x)       ;; => false
(just-value x)     ;; => 42
```
