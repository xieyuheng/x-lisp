---
title: assert-not
---

# Type

```scheme
(-> bool-t void-t)
```

# Description

Assert a condition is false. Raises an error if the condition is true.

# Examples

```scheme
(assert-not (= 1 2))
(assert-not (< 2 1))
```
