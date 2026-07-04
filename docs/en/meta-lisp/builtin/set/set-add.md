---
title: set-add
---

# Type

```scheme
(polymorphic (E) (-> E (set-t E) (set-t E)))
```

# Description

Add an element to the set, returning a new set.

# Examples

```scheme
(set-add 4 #{1 2 3})  ;; => #{1 2 3 4}
(set-add 1 #{1 2 3})  ;; => #{1 2 3}
```
