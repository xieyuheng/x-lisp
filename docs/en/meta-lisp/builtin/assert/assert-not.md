---
title: assert-not
---

# Type

```meta-lisp
(-> bool-t void-t)
```

# Description

Assert a condition is false. Raises an error if the condition is true.

# Examples

```meta-lisp
(assert-not (= 1 2))
(assert-not (< 2 1))
```
