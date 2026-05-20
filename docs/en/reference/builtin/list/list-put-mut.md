---
title: list-put!
---

# Type

```scheme
(polymorphic (E) (-> int-t E (list-t E) (list-t E)))
```

# Description

Set element by index, same behavior as `list-put`.

# Examples

```scheme
(list-put! 0 10 [1 2 3])  ;; => [10 2 3]
```
