---
title: set-delete
---

# Type

```meta-lisp
(all (E) (-> (set-t E) E (set-t E)))
```

# Description

Delete an element from the set. Mutates the set in place.

# Examples

```meta-lisp
(set-delete (@set 1 2 3) 2)  ;; => (@set 1 3)
```
