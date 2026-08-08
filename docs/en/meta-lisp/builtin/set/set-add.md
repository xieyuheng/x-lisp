---
title: set-add
---

# Type

```meta-lisp
(all (E) (-> E (set-t E) (set-t E)))
```

# Description

Add an element to the set, same as `set-copy-add`.

# Examples

```meta-lisp
(set-add 4 (@set 1 2 3))  ;; => (@set 1 2 3 4)
```
