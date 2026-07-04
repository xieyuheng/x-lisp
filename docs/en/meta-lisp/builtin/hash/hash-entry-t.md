---
title: hash-entry-t
---

# Type

```meta-lisp
type-t
```

# Description

Hash table entry type constructor. `(hash-entry-t K V)` represents a key-value entry with key type `K` and value type `V`.

# Definition

```meta-lisp
(define-struct (hash-entry-t K V)
  (key K)
  (value V))
```

# Generated

```meta-lisp
(claim make-hash-entry (polymorphic (K V) (-> K V (hash-entry-t K V))))
(claim hash-entry-key   (polymorphic (K V) (-> (hash-entry-t K V) K)))
(claim hash-entry-value (polymorphic (K V) (-> (hash-entry-t K V) V)))
```

# Examples

```meta-lisp
(let ((e (make-hash-entry "a" 1)))
  (hash-entry-key e))   ;; => "a"
```
