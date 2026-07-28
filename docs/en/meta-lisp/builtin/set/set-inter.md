---
title: set-inter
---

# Type

```meta-lisp
(polymorphic (E) (-> (set-t E) (set-t E) (set-t E)))
```

# Description

Intersection of two sets.

# Examples

```meta-lisp
(set-inter (@set 1 2 3) (@set 2 3 4))  ;; => (@set 2 3)
(set-inter (@set 1) (@set 2))          ;; => (@set) 
```
