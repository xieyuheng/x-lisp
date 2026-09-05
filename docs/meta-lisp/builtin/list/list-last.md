---
title: list-last
---

# Type

```meta-lisp
(all (E) (-> (list-t E) E))
```

# Description

Last element of the list.

# Examples

```meta-lisp
(list-last (@list 1 2 3))  ;; => 3
(list-last (@list 1))      ;; => 1
```
