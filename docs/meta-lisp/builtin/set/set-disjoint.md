---
title: set-disjoint
---

# Type

```meta-lisp
(all (E) (-> (set-t E) (set-t E) bool-t))
```

# Description

Check if two sets are disjoint (no common elements).

# Examples

```meta-lisp
(set-disjoint (@set 1 2) (@set 3 4))  ;; => true
(set-disjoint (@set 1 2) (@set 2 3))  ;; => false
```
