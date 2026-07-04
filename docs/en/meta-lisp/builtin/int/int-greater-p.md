---
title: int-greater?
---

# Type

```meta-lisp
(-> int-t int-t bool-t)
```

# Description

Check if the first integer is greater than the second.

# Examples

```meta-lisp
(int-greater? 2 1)     ;; => true
(int-greater? 1 2)     ;; => false
(int-greater? 1 1)     ;; => false
```
