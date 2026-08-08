---
title: list-copy-put
---

# Type

```meta-lisp
(all (E) (-> int-t E (list-t E) (list-t E)))
```

# Description

Set element by index, returning a new list. The original list is unchanged.

# Examples

```meta-lisp
(list-copy-put 0 10 [1 2 3])  ;; => [10 2 3]
(list-copy-put 1 10 [1 2 3])  ;; => [1 10 3]
```
