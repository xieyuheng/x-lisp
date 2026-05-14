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
(assert (= 1 1))
(assert (> 2 1))
```
