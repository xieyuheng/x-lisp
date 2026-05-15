---
title: hash-entry-t
---

# Type

```scheme
(-> type-t type-t type-t)
```

# Description

Hash table entry type constructor. `(hash-entry-t K V)` represents a key-value entry with key type `K` and value type `V`.

# Generated

## Constructor

```scheme
(claim make-hash-entry (polymorphic (K V) (-> K V (hash-entry-t K V))))
```

## Accessor

```scheme
(claim hash-entry-key   (polymorphic (K V) (-> (hash-entry-t K V) K)))
(claim hash-entry-value (polymorphic (K V) (-> (hash-entry-t K V) V)))
```

# Examples

```scheme
(let ((e (make-hash-entry "a" 1)))
  (hash-entry-key e))   ;; => "a"
```
