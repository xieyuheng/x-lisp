---
title: set-subset?
---

# Type

```scheme
(polymorphic (E) (-> (set-t E) (set-t E) bool-t))
```

# Description

Check if the first set is a subset of the second.

# Examples

```scheme
(set-subset? #{1 2} #{1 2 3})  ;; => true
(set-subset? #{1 2 3} #{1 2})  ;; => false
(set-subset? #{} #{1 2 3})     ;; => true
```
