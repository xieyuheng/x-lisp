---
title: for-hash-key
---

# Type

```meta-lisp
(polymorphic (K V Any) (-> (hash-t K V) (-> K Any) void-t))
```

# Description

`for-hash-key` is the data-first version of `hash-each-key`.
Equivalent to `(hash-each-key fn data)`.

Iterate over each key with side effects.

# Examples

```meta-lisp
(for-hash-key (@hash 1 2 3 4) println)
```
