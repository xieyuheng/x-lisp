---
title: set-empty?
---

# Type

```scheme
(polymorphic (E) (-> (set-t E) bool-t))
```

# Description

Check if the set is empty.

# Examples

```scheme
(set-empty? #{})       ;; => true
(set-empty? #{1 2 3})  ;; => false
```
