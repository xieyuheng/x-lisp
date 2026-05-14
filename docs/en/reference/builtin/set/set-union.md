---
title: set-union
---

# Type

```scheme
(polymorphic (E) (-> (set-t E) (set-t E) (set-t E)))
```

# Description

Union of two sets.

# Examples

```scheme
(set-union #{1 2} #{2 3})  ;; => #{1 2 3}
(set-union #{1} #{})       ;; => #{1}
```
