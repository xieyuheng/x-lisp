---
title: set-size
---

# Type

```meta-lisp
(polymorphic (E) (-> (set-t E) int-t))
```

# Description

Number of elements in the set.

# Examples

```meta-lisp
(set-size #{1 2 3})  ;; => 3
(set-size #{})       ;; => 0
```
