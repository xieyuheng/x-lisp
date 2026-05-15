---
title: hash-entry-key
---

# Type

```scheme
(polymorphic (K V) (-> (hash-entry-t K V) K))
```

# Description

Get the key of an entry.

# Examples

```scheme
(let ((entries (hash-entries (@hash 'a 1 'b 2))))
  (list-map hash-entry-key entries))  ;; => ['a 'b]
```
