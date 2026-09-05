---
title: list-concat
---

# Type

```meta-lisp
(all (A) (-> (list-t (list-t A)) (list-t A)))
```

# Description

Flatten a list of lists by one level.

# Examples

```meta-lisp
(list-concat (@list (@list 1 2) (@list 3 4) (@list 5)))  ;; => (@list 1 2 3 4 5)
```
