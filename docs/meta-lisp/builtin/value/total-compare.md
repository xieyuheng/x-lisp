---
title: total-compare
---

# Type

```meta-lisp
(all (A B) (-> A B int-t))
```

# Description

Total order comparison. Returns a negative, zero, or positive number indicating whether the first value is less than, equal to, or greater than the second value.

# Examples

```meta-lisp
(total-compare 1 2)   ;; => negative
(total-compare 2 2)   ;; => 0
(total-compare 3 2)   ;; => positive
```
