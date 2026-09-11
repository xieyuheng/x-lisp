---
title: hash-each-key
---

# Type

```meta-lisp
(all (K V Any) (-> (hash-t K V) (-> K Any) void-t))
```

# Description

Iterate over each key with side effects.

# Examples

```meta-lisp
(hash-each-key
  (@hash 1 2 3 4)
  (lambda (key) (println key)))
```
