---
title: set-to-list
---

# Type

```meta-lisp
(polymorphic (E) (-> (set-t E) (list-t E)))
```

# Description

Convert a set to a list.

# Examples

```meta-lisp
(set-to-list #{1 2 3})  ;; => [1 2 3]
(set-to-list #{})       ;; => []
```
