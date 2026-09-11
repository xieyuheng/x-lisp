---
title: hash-each-entry
---

# Type

```meta-lisp
(all (K V Any) (-> (hash-t K V) (-> (pair-t K V) Any) void-t))
```

# Description

Iterate over each entry with side effects.

# Examples

```meta-lisp
(hash-each-entry
  (@hash 1 2 3 4)
  (lambda (entry) (println entry)))
```
