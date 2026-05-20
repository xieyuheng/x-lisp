---
title: same?
---

# Type

```scheme
(polymorphic (A B) (-> A B bool-t))
```

# Description

Check if two values are the same atom or reference.

# Examples

```scheme
(same? 1 1)              ;; => true
(same? "a" "a")          ;; => true
(same? [1 2 3] [1 2 3])  ;; => false
```

