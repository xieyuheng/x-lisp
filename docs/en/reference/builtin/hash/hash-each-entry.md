---
title: hash-each-entry
---

# Type

```scheme
(polymorphic (K V Any) (-> (-> (hash-entry-t K V) Any) (hash-t K V) void-t))
```

# Description

Iterate over each entry with side effects.

# Examples

```scheme
(= h (@hash 1 2 3 4))
(= acc [])
(hash-each-entry (lambda (e) (list-push! e acc)) h)
acc  ;; => [(make-hash-entry 1 2) (make-hash-entry 3 4)]
```
