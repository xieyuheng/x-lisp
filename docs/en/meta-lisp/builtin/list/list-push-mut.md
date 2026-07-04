---
title: list-push!
---

# Type

```meta-lisp
(polymorphic (E) (-> E (list-t E) (list-t E)))
```

# Description

Append an element at the end of the list, same as `list-push`.

# Examples

```meta-lisp
(list-push! 4 [1 2 3])  ;; => [1 2 3 4]
```
