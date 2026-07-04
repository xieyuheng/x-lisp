---
title: for-hash-entry
---

# Type

```scheme
(polymorphic (K V Any) (-> (hash-t K V) (-> (hash-entry-t K V) Any) void-t))
```

# Description

`for-hash-entry` is the data-first version of `hash-each-entry`.
Equivalent to `(hash-each-entry fn data)`.

Iterate over each entry with side effects.

# Examples

```scheme
(for-hash-entry (@hash 1 2 3 4) println)
```
