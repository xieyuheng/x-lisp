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
(assert-not (equal 1 2))
(assert-not (int-less 2 1))
```
