---
title: hash-each-value
---

# Type

```scheme
(polymorphic (K V Any) (-> (-> V Any) (hash-t K V) void-t))
```

# Description

Iterate over each value with side effects.

# Examples

```scheme
(= h (@hash 1 2 3 4))
(= acc [])
(hash-each-value (lambda (v) (list-push! v acc)) h)
acc  ;; => [2 4]
```
