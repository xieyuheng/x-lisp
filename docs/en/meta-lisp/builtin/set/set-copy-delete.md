---
title: set-copy-delete
---

# Type

```meta-lisp
(all (E) (-> E (set-t E) (set-t E)))
```

# Description

Delete an element from the set, returning a new set.

# Examples

```meta-lisp
(set-copy-delete 2 (@set 1 2 3))  ;; => (@set 1 3)
(set-copy-delete 0 (@set 1 2 3))  ;; => (@set 1 2 3)
```
