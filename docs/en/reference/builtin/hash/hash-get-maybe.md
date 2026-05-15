---
title: hash-get-maybe
---

# Type

```scheme
(polymorphic (K V) (-> K (hash-t K V) (maybe-t V)))
```

# Description

Look up a key, returning a `(just V)` if found or `nothing` if not found.

# Examples

```scheme
(hash-get-maybe 2 (@hash 1 "a" 2 "b" 3 "c"))  ;; => (just "b")
(hash-get-maybe 4 (@hash 1 "a" 2 "b" 3 "c"))  ;; => nothing
```
