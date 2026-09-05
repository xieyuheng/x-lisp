---
title: set-to-list
---

# Type

```meta-lisp
(all (E) (-> (set-t E) (list-t E)))
```

# Description

Convert a set to a list.

# Examples

```meta-lisp
(set-to-list (@set 1 2 3))  ;; => (@list 1 2 3)
(set-to-list (@set))       ;; => (@list)
```
