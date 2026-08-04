---
title: hash-each-entry
---

# Type

```meta-lisp
(polymorphic (K V Any) (-> (-> (pair-t K V) Any) (hash-t K V) void-t))
```

# Description

Iterate over each entry with side effects.

# Examples

```meta-lisp
(hash-each-entry
  (lambda (entry) (println entry))
  (@hash 1 2 3 4))
```
