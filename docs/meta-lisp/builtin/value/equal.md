---
title: equal
---

# Type

```meta-lisp
(all (A B) (-> A B bool-t))
```

# Description

Check if two values are structurally equal (deep comparison).

# Examples

```meta-lisp
(equal 1 1)          ;; => true
(equal "a" "a")      ;; => true
(equal (@list 1 2) (@list 1 2))  ;; => true
```
