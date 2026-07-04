---
title: assert-not-equal
---

# Type

```scheme
(polymorphic (A B) (-> A B void-t))
```

# Description

Assert two values are not equal. Raises an error if they are equal.

# Examples

```scheme
(assert-not-equal 1 2)
(assert-not-equal "a" "b")
```
