---
title: set-add
---

# Type

```meta-lisp
(polymorphic (E) (-> E (set-t E) (set-t E)))
```

# Description

Add an element to the set, returning a new set.

# Examples

```meta-lisp
(set-add 4 (@set 1 2 3))  ;; => (@set 1 2 3 4)
(set-add 1 (@set 1 2 3))  ;; => (@set 1 2 3)
```
