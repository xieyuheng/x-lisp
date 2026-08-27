---
title: list-length
---

# Type

```meta-lisp
(all (E) (-> (list-t E) int-t))
```

# Description

Number of elements in the list.

# Examples

```meta-lisp
(list-length [1 2 3])  ;; => 3
(list-length [])       ;; => 0
```
