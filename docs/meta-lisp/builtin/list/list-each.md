---
title: list-each
---

# Type

```meta-lisp
(all (A Any) (-> (list-t A) (-> A Any) void-t))
```

# Description

Apply a side-effecting function to each element.

# Examples

```meta-lisp
(list-each (@list 1 2 3) println)
;; Output:
;; 1
;; 2
;; 3
```
