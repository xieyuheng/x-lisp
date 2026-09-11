---
title: set-has
---

# Type

```meta-lisp
(all (E) (-> (set-t E) E bool-t))
```

# Description

Check if an element exists in the set.

# Examples

```meta-lisp
(set-has (@set 1 2 3) 2)  ;; => true
(set-has (@set 1 2 3) 0)  ;; => false
```
