---
title: set-delete!
---

# Type

```scheme
(polymorphic (E) (-> E (set-t E) (set-t E)))
```

# Description

Delete an element from the set, same as `set-delete`.

# Examples

```scheme
(set-delete! 2 #{1 2 3})  ;; => #{1 3}
```
