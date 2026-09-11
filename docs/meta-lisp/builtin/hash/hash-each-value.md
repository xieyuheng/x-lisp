---
title: hash-each-value
---

# Type

```meta-lisp
(all (K V Any) (-> (hash-t K V) (-> V Any) void-t))
```

# Description

Iterate over each value with side effects.

# Examples

```meta-lisp
(hash-each-value
  (@hash 1 2 3 4)
  (lambda (value) (println value)))
```
