---
title: hash-each
---

# Type

```scheme
(polymorphic (K V Any) (-> (-> K V Any) (hash-t K V) void-t))
```

# Description

Iterate over each key-value pair with side effects.

# Examples

```scheme
(hash-each
  (lambda (key value)
    (println key)
    (println value))
  (@hash 1 2 3 4))
```
