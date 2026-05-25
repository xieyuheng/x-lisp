---
title: maybe-t
---

# Type

```scheme
type-t
```

# Definition

```scheme
(define-enum (maybe-t A)
  (just (value A))
  (nothing))
```

# Generated

```scheme
(claim just  (polymorphic (A) (-> A (maybe-t A))))
(claim just? (polymorphic (A) (-> (maybe-t A) bool-t)))
(claim just-value (polymorphic (A) (-> (maybe-t A) A)))
(claim just-put-value! (polymorphic (A) (-> A (maybe-t A) (maybe-t A))))

(claim nothing (polymorphic (A) (-> (maybe-t A))))
(claim nothing? (polymorphic (A) (-> (maybe-t A) bool-t)))
```

# Examples

```scheme
(define x (just 42))
(just? x)          ;; => true
(nothing? x)       ;; => false
(just-value x)     ;; => 42
```
