---
title: list-put-copy
---

# Type

```meta-lisp
(polymorphic (E) (-> int-t E (list-t E) (list-t E)))
```

# Description

Set element by index, returning a new list. The original list is unchanged.

# Examples

```meta-lisp
(list-put-copy 0 10 [1 2 3])  ;; => [10 2 3]
(list-put-copy 1 10 [1 2 3])  ;; => [1 10 3]
```
