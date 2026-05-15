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
(= h (@hash 1 2 3 4))
(= acc [])
(hash-each (lambda (k v) (list-push! k acc) (list-push! v acc)) h)
acc  ;; => [1 2 3 4]
```
