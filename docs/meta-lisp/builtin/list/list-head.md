---
title: list-head
---

# Type

```meta-lisp
(all (E) (-> (list-t E) E))
```

# Description

First element of the list, same as `car`.

# Examples

```meta-lisp
(list-head (@list 1 2 3))  ;; => 1
```
