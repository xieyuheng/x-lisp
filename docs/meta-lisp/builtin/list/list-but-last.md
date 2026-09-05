---
title: list-but-last
---

# Type

```meta-lisp
(all (E) (-> (list-t E) (list-t E)))
```

# Description

All elements of the list except the last one.

# Examples

```meta-lisp
(list-but-last (@list 1 2 3))  ;; => (@list 1 2)
(list-but-last (@list 1))      ;; => (@list)
```
