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
(list-each println (@list 1 2 3))
;; outputs:
;; 1
;; 2
;; 3
```
