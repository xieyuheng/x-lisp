---
title: list-pop
---

# Type

```meta-lisp
(all (E) (-> (list-t E) E))
```

# Description

Pop the last element from the list.

# Examples

```meta-lisp
(list-pop (@list 1 2 3))  ;; => 3
(list-pop (@list 1))      ;; => 1
```
