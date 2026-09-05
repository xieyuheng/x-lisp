---
title: list-find
---

# Type

```meta-lisp
(all (A) (-> (-> A bool-t) (list-t A) (maybe-t A)))
```

# Description

Find the first element satisfying the predicate, returning `(just value)` or `(nothing)`.

# Examples

```meta-lisp
(list-find int? (@list 'a 'b 3 'd))  ;; => (just 3)
(list-find int? (@list 'a 'b 'c))    ;; => (nothing)
```
