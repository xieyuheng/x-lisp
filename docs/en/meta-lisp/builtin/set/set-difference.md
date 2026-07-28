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
(set-difference (@set 1 2 3) (@set 2 3))  ;; => (@set 1)
(set-difference (@set 1 2) (@set 1 2 3))  ;; => (@set) 
```
