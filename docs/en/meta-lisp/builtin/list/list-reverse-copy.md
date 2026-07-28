---
title: list-reverse-copy
---

# Type

```meta-lisp
(polymorphic (E) (-> (list-t E) (list-t E)))
```

# Description

Reverse the list.

# Examples

```meta-lisp
(list-reverse-copy [1 2 3])  ;; => [3 2 1]
(list-reverse-copy [])       ;; => []
```
