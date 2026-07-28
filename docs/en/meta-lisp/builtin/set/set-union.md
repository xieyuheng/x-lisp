---
title: set-union
---

# Type

```meta-lisp
(polymorphic (E) (-> (set-t E) (set-t E) (set-t E)))
```

# Description

Union of two sets.

# Examples

```meta-lisp
(set-union (@set 1 2) (@set 2 3))  ;; => (@set 1 2 3)
(set-union (@set 1) (@set) )       ;; => (@set 1)
```
