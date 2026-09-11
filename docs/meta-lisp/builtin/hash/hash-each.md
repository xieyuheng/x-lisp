---
title: hash-each
---

# Type

```meta-lisp
(all (K V Any) (-> (hash-t K V) (-> K V Any) void-t))
```

# Description

Iterate over each key-value pair with side effects.

# Examples

```meta-lisp
(hash-each
  (@hash 1 2 3 4)
  (lambda (key value)
    (println key)
    (println value)))
```
