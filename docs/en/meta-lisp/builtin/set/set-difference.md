---
title: set-difference
---

# Type

```scheme
(polymorphic (E) (-> (set-t E) (set-t E) (set-t E)))
```

# Description

Difference of two sets (elements in the first but not in the second).

# Examples

```scheme
(set-difference #{1 2 3} #{2 3})  ;; => #{1}
(set-difference #{1 2} #{1 2 3})  ;; => #{}
```
