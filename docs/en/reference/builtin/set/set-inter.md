---
title: set-inter
---

# Type

```scheme
(polymorphic (E) (-> (set-t E) (set-t E) (set-t E)))
```

# Description

Intersection of two sets.

# Examples

```scheme
(set-inter #{1 2 3} #{2 3 4})  ;; => #{2 3}
(set-inter #{1} #{2})          ;; => #{}
```
