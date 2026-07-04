---
title: hash-each-value
---

# Type

```meta-lisp
(polymorphic (K V Any) (-> (-> V Any) (hash-t K V) void-t))
```

# Description

Iterate over each value with side effects.

# Examples

```meta-lisp
(hash-each-value
  (lambda (value) (println value))
  (@hash 1 2 3 4))
```
