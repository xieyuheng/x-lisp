---
title: list-tail
---

# Type

```scheme
(polymorphic (E) (-> (list-t E) (list-t E)))
```

# Description

Rest of the list after removing the first element, same as `cdr`.

# Examples

```scheme
(list-tail [1 2 3])  ;; => [2 3]
```
