---
title: list-pop-front!
---

# Type

```scheme
(polymorphic (E) (-> (list-t E) E))
```

# Description

Pop the first element from the list, same as `car`.

# Examples

```scheme
(list-pop-front! [1 2 3])  ;; => 1
```
