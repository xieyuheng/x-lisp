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
(hash-each-entry
  (lambda (entry) (println entry))
  (@hash 1 2 3 4))
```
