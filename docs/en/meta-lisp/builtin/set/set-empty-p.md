---
title: set-empty?
---

# Type

```meta-lisp
(polymorphic (E) (-> (set-t E) bool-t))
```

# Description

Check if the set is empty.

# Examples

```meta-lisp
(set-empty? (@set) )       ;; => true
(set-empty? (@set 1 2 3))  ;; => false
```
