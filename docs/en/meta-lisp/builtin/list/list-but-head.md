---
title: list-but-head
---

# Type

```meta-lisp
(polymorphic (E) (-> (list-t E) (list-t E)))
```

# Description

Rest of the list after removing the first element, same as `cdr`.

# Examples

```meta-lisp
(list-but-head [1 2 3])  ;; => [2 3]
```
