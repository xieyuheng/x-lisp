---
title: assert-equal
---

# Type

```scheme
(polymorphic (A B) (-> A B void-t))
```

# Description

Assert two values are equal (compared using `equal?`). Raises an error if they are not equal.

# Examples

```scheme
(assert-equal 1 1)
(assert-equal "hello" "hello")
```
