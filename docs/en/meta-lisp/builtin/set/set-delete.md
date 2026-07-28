---
title: set-delete
---

# Type

```meta-lisp
(polymorphic (E) (-> E (set-t E) (set-t E)))
```

# Description

Delete an element from the set. Mutates the set in place.

# Examples

```meta-lisp
(set-delete 2 (@set 1 2 3))  ;; => (@set 1 3)
```
