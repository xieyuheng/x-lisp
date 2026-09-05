---
title: list-append
---

# Type

```meta-lisp
(all (A) (-> (list-t A) (list-t A) (list-t A)))
```

# Description

Concatenate two lists.

# Examples

```meta-lisp
(list-append (@list 1 2 3) (@list 4 5 6))  ;; => (@list 1 2 3 4 5 6)
```
