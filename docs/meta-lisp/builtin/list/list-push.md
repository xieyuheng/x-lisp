---
title: list-push
---

# Type

```meta-lisp
(all (E) (-> E (list-t E) (list-t E)))
```

# Description

Append an element at the end of the list.

# Examples

```meta-lisp
(list-push 4 [1 2 3])  ;; => [1 2 3 4]
```
