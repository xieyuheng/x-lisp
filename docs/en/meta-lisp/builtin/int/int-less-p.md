---
title: int-less?
---

# Type

```meta-lisp
(-> int-t int-t bool-t)
```

# Description

Check if the first integer is less than the second.

# Examples

```meta-lisp
(int-less? 1 2)      ;; => true
(int-less? 2 1)      ;; => false
(int-less? 1 1)      ;; => false
```
