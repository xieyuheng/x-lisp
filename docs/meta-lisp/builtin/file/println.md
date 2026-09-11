---
title: println
---

# Type

```meta-lisp
(all (A) (-> A void-t))
```

# Description

Print any value to standard output followed by a newline.

# Examples

```meta-lisp
(list-each (@list 1 2 3) println)
;; outputs:
;; 1
;; 2
;; 3
```
