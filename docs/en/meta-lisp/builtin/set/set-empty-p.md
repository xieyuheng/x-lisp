---
title: set-empty?
---

# Type

```meta-lisp
(polymorphic (E) (-> (set-t E) bool-t))
```

# Description

Check if the set is empty.

# Examples

```meta-lisp
(set-empty? #{})       ;; => true
(set-empty? #{1 2 3})  ;; => false
```
