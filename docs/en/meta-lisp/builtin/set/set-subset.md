---
title: set-subset
---

# Type

```meta-lisp
(polymorphic (E) (-> (set-t E) (set-t E) bool-t))
```

# Description

Check if the first set is a subset of the second.

# Examples

```meta-lisp
(set-subset (@set 1 2) (@set 1 2 3))  ;; => true
(set-subset (@set 1 2 3) (@set 1 2))  ;; => false
(set-subset (@set) (@set 1 2 3))     ;; => true
```
