---
title: set-clear
---

# Type

```meta-lisp
(all (E) (-> (set-t E) (set-t E)))
```

# Description

Clear the set, returning an empty set.

# Examples

```meta-lisp
(set-clear (@set 1 2 3))  ;; => (@set) 
```
