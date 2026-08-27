---
title: for-hash-value
---

# Type

```meta-lisp
(all (K V Any) (-> (hash-t K V) (-> V Any) void-t))
```

# Description

`for-hash-value` is the data-first version of `hash-each-value`.
Equivalent to `(hash-each-value fn data)`.

Iterate over each value with side effects.

# Examples

```meta-lisp
(for-hash-value (@hash 1 2 3 4) println)
```
