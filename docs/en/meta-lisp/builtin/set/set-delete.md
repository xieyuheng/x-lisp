---
title: set-delete
---

# Type

```scheme
(polymorphic (E) (-> E (set-t E) (set-t E)))
```

# Description

Delete an element from the set, returning a new set.

# Examples

```scheme
(set-delete 2 #{1 2 3})  ;; => #{1 3}
(set-delete 0 #{1 2 3})  ;; => #{1 2 3}
```
