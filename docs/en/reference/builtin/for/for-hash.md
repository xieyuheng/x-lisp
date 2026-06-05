---
title: for-hash
---

# Type

```scheme
(polymorphic (K V Any) (-> (hash-t K V) (-> K V Any) void-t))
```

# Description

`for-hash` is the data-first version of `hash-each`.
Equivalent to `(hash-each fn data)`.

Iterate over each key-value pair with side effects.

# Examples

```scheme
(for-hash (@hash 1 2 3 4)
  (lambda (key value)
    (println key)
    (println value)))
```
