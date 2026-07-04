---
title: int-less-or-equal?
---

# Type

```scheme
(-> int-t int-t bool-t)
```

# Description

Check if the first integer is less than or equal to the second.

# Examples

```scheme
(int-less-or-equal? 1 2)    ;; => true
(int-less-or-equal? 1 1)    ;; => true
(int-less-or-equal? 2 1)    ;; => false
```
