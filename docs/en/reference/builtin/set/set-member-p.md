---
title: set-member?
---

# Type

```scheme
(polymorphic (E) (-> E (set-t E) bool-t))
```

# Description

Check if an element exists in the set.

# Examples

```scheme
(set-member? 2 #{1 2 3})  ;; => true
(set-member? 0 #{1 2 3})  ;; => false
```
