---
title: hash-get-maybe
---

# Type

```meta-lisp
(all (K V) (-> (hash-t K V) K (maybe-t V)))
```

# Description

Look up a key, returning a `(just V)` if found or `nothing` if not found.

# Examples

```meta-lisp
(hash-get-maybe (@hash 1 "a" 2 "b" 3 "c") 2)  ;; => (just "b")
(hash-get-maybe (@hash 1 "a" 2 "b" 3 "c") 4)  ;; => nothing
```
