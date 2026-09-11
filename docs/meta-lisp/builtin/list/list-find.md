---
title: list-find
---

# Type

```meta-lisp
(all (A) (-> (list-t A) (-> A bool-t) (maybe-t A)))
```

# Description

Find the first element satisfying the predicate, returning `(just value)` or `(nothing)`.

# Examples

```meta-lisp
(list-find (@list 'a 'b 3 'd) int?)  ;; => (just 3)
(list-find (@list 'a 'b 'c) int?)    ;; => (nothing)
```
