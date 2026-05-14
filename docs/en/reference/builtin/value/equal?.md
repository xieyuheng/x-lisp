---
title: equal?
---

# Type

```scheme
(polymorphic (A B) (-> A B bool-t))
```

# Description

Check if two values are structurally equal (deep comparison).

# Examples

```scheme
(equal? 1 1)          ;; => true
(equal? "a" "a")      ;; => true
(equal? [1 2] [1 2])  ;; => true
```
