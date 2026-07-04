---
title: for-list
---

# Type

```meta-lisp
(polymorphic (A Any) (-> (list-t A) (-> A Any) void-t))
```

# Description

`for-list` is the data-first version of `list-each`.
Equivalent to `(list-each fn data)`.

Apply a side-effecting function to each element.

# Examples

```meta-lisp
(for-list [1 2 3] println)
```
