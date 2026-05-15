---
title: assert
---

# Type

```scheme
(-> bool-t void-t)
```

# Description

Assert a condition is true. Raises an error if the condition is false.

# Examples

```scheme
(assert (equal? 1 1))
(assert (int-greater? 2 1))
```
