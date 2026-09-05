---
title: list-rest
---

# Type

```meta-lisp
(all (E) (-> (list-t E) (list-t E)))
```

# Description

Rest of the list after removing the first element, same as `cdr`.

# Examples

```meta-lisp
(list-rest (@list 1 2 3))  ;; => (@list 2 3)
```
