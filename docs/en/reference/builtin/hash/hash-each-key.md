---
title: hash-each-key
---

# Type

```scheme
(polymorphic (K V Any) (-> (-> K Any) (hash-t K V) void-t))
```

# Description

Iterate over each key with side effects.

# Examples

```scheme
(let ((h (@hash 1 2 3 4))
      (acc []))
  (hash-each-key (lambda (k) (list-push! k acc)) h)
  acc)
```
