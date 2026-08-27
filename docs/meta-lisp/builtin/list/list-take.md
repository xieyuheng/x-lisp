---
title: list-take
---

# Type

```meta-lisp
(all (A) (-> int-t (list-t A) (list-t A)))
```

# Description

Take the first `n` elements of the list. Returns the whole list if `n` exceeds the list length.

# Examples

```meta-lisp
(list-take 2 [1 2 3 4])  ;; => [1 2]
(list-take 0 [1 2 3])    ;; => []
(list-take 5 [1 2 3])    ;; => [1 2 3]
```
