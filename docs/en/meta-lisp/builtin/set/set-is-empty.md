---
title: set-is-empty
---

# Type

```meta-lisp
(all (E) (-> (set-t E) bool-t))
```

# Description

Check if the set is empty.

# Examples

```meta-lisp
(set-is-empty (@set) )       ;; => true
(set-is-empty (@set 1 2 3))  ;; => false
```
