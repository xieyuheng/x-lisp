---
title: for-list-index
---

# Type

```meta-lisp
(all (A Any) (-> (list-t A) (-> int-t A Any) void-t))
```

# Description

`for-list-index` is the data-first version of `list-each-index`.
Equivalent to `(list-each-index fn data)`.

Apply a side-effecting function with index to each element.

# Examples

```meta-lisp
(for-list-index (@list 'a 'b 'c)
  (lambda (i x)
    (println i)
    (println x)))
```
