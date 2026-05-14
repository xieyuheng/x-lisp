---
title: same?
---

# Type

```scheme
(polymorphic (A B) (-> A B bool-t))
```

# Description

Check if two values are the same (reference equality).

# Examples

```scheme
(same? 1 1)          ;; => true
(same? "a" "a")      ;; => false (strings may not share references)
```
