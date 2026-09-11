---
title: set-copy-add
---

# Type

```meta-lisp
(all (E) (-> (set-t E) E (set-t E)))
```

# Description

Add an element to the set, returning a new set.

# Examples

```meta-lisp
(set-copy-add (@set 1 2 3) 4)  ;; => (@set 1 2 3 4)
(set-copy-add (@set 1 2 3) 1)  ;; => (@set 1 2 3)
```
