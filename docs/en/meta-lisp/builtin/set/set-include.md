---
title: set-include
---

# Type

```meta-lisp
(all (E) (-> (set-t E) (set-t E) bool-t))
```

# Description

Check if the first set is included in the second.

# Examples

```meta-lisp
(set-include (@set 1 2) (@set 1 2 3))  ;; => true
(set-include (@set 1 2 3) (@set 1 2))  ;; => false
(set-include (@set) (@set 1 2 3))     ;; => true
```
