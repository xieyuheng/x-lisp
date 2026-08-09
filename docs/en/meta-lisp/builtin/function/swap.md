---
title: swap
---

# Type

```meta-lisp
(all (A B C)
  (-> (-> A B C)
      (-> B A C)))
```

# Description

Swap the two arguments of a function.

# Examples

```meta-lisp
((swap isub) 10 3)  ;; => -7 (equivalent to (isub 3 10))
```
