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
(claim just  (all (A) (-> A (maybe-t A))))
(claim is-just (all (A) (-> (maybe-t A) bool-t)))
(claim just-value (all (A) (-> (maybe-t A) A)))
(claim just-put-value (all (A) (-> A (maybe-t A) (maybe-t A))))

(claim nothing (all (A) (-> (maybe-t A))))
(claim is-nothing (all (A) (-> (maybe-t A) bool-t)))
```

# Examples

```meta-lisp
(define x (just 42))
(is-just x)          ;; => true
(is-nothing x)       ;; => false
(just-value x)     ;; => 42
```
