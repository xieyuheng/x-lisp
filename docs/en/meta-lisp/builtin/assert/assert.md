---
title: assert
---

# Type

```meta-lisp
(-> bool-t void-t)
```

# Description

Assert a condition is true. Raises an error if the condition is false.

# Examples

```meta-lisp
(assert (equal? 1 1))
(assert (int-greater? 2 1))
```
