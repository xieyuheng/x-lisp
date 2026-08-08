---
title: set-copy-add
---

# Type

```meta-lisp
(all (E) (-> E (set-t E) (set-t E)))
```

# Description

Add an element to the set, returning a new set.

# Examples

```meta-lisp
(set-copy-add 4 (@set 1 2 3))  ;; => (@set 1 2 3 4)
(set-copy-add 1 (@set 1 2 3))  ;; => (@set 1 2 3)
```
