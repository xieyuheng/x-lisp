---
title: list-push-front!
---

# Type

```scheme
(polymorphic (E) (-> E (list-t E) (list-t E)))
```

# Description

Prepend an element at the front of the list, same as `cons`.

# Examples

```scheme
(list-push-front! 1 [2 3])  ;; => [1 2 3]
```
