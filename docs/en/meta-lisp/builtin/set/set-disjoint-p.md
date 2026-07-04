---
title: set-disjoint?
---

# Type

```meta-lisp
(polymorphic (E) (-> (set-t E) (set-t E) bool-t))
```

# Description

Check if two sets are disjoint (no common elements).

# Examples

```meta-lisp
(set-disjoint? #{1 2} #{3 4})  ;; => true
(set-disjoint? #{1 2} #{2 3})  ;; => false
```
