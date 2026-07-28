---
title: set-delete-copy
---

# Type

```meta-lisp
(polymorphic (E) (-> E (set-t E) (set-t E)))
```

# Description

Delete an element from the set, returning a new set.

# Examples

```meta-lisp
(set-delete-copy 2 (@set 1 2 3))  ;; => (@set 1 3)
(set-delete-copy 0 (@set 1 2 3))  ;; => (@set 1 2 3)
```
