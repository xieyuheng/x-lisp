---
title: list-find-index
---

# Type

```meta-lisp
(all (A) (-> (list-t A) (-> A bool-t) int-t))
```

# Description

Find the index of the first element satisfying the predicate. Returns `-1` if not found.

# Examples

```meta-lisp
(list-find-index (@list 'a 'b 3 'd) int?)  ;; => 2
(list-find-index (@list 'a 'b 'c) int?)    ;; => -1
```
