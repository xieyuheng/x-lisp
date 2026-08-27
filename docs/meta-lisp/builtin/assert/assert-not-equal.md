---
title: assert-not-equal
---

# Type

```meta-lisp
(all (A B) (-> A B void-t))
```

# Description

Assert two values are not equal. Raises an error if they are equal.

# Examples

```meta-lisp
(assert-not-equal 1 2)
(assert-not-equal "a" "b")
```
