---
title: set-difference
---

# Type

```meta-lisp
(polymorphic (E) (-> (set-t E) (set-t E) (set-t E)))
```

# Description

Difference of two sets (elements in the first but not in the second).

# Examples

```meta-lisp
(set-difference #{1 2 3} #{2 3})  ;; => #{1}
(set-difference #{1 2} #{1 2 3})  ;; => #{}
```
