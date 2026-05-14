---
title: cons
---

# Type

```scheme
(polymorphic (E) (-> E (list-t E) (list-t E)))
```

# Description

Prepend an element at the front of the list.

# Examples

```scheme
(cons 1 [2 3])    ;; => [1 2 3]
(cons "a" [])     ;; => ["a"]
```
