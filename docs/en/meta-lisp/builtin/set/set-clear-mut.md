---
title: set-clear!
---

# Type

```scheme
(polymorphic (E) (-> (set-t E) (set-t E)))
```

# Description

Clear the set, returning an empty set.

# Examples

```scheme
(set-clear! #{1 2 3})  ;; => #{}
```
