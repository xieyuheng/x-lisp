---
title: list-put
---

# Type

```scheme
(polymorphic (E) (-> int-t E (list-t E) (list-t E)))
```

# Description

Set element by index, returning a new list. The original list is unchanged.

# Examples

```scheme
(list-put 0 10 [1 2 3])  ;; => [10 2 3]
(list-put 1 10 [1 2 3])  ;; => [1 10 3]
```
