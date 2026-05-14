---
title: list-reverse
---

# Type

```scheme
(polymorphic (E) (-> (list-t E) (list-t E)))
```

# Description

Reverse the list.

# Examples

```scheme
(list-reverse [1 2 3])  ;; => [3 2 1]
(list-reverse [])       ;; => []
```
