---
title: set-is-member
---

# Type

```meta-lisp
(polymorphic (E) (-> E (set-t E) bool-t))
```

# Description

Check if an element exists in the set.

# Examples

```meta-lisp
(set-is-member 2 (@set 1 2 3))  ;; => true
(set-is-member 0 (@set 1 2 3))  ;; => false
```
