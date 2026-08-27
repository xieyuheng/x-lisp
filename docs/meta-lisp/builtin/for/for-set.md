---
title: for-set
---

# Type

```meta-lisp
(all (A Any) (-> (set-t A) (-> A Any) void-t))
```

# Description

`for-set` is the data-first version of `set-each`.
Equivalent to `(set-each fn data)`.

Apply a side-effecting function to each element of a set.

# Examples

```meta-lisp
(for-set (@set 1 2 3) println)
```
