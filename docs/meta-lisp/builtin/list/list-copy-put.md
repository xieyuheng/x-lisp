---
title: list-copy-put
---

# Type

```meta-lisp
(all (E) (-> (list-t E) int-t E (list-t E)))
```

# Description

Set element by index, returning a new list. The original list is unchanged.

# Examples

```meta-lisp
(list-copy-put (@list 1 2 3) 0 10)  ;; => (@list 10 2 3)
(list-copy-put (@list 1 2 3) 1 10)  ;; => (@list 1 10 3)
```
