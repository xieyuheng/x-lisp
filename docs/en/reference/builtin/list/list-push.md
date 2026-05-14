---
title: list-push
---

# Type

```scheme
(polymorphic (E) (-> E (list-t E) (list-t E)))
```

# Description

Append an element at the end of the list.

# Examples

```scheme
(list-push 4 [1 2 3])  ;; => [1 2 3 4]
(list-push 1 [])       ;; => [1]
```
