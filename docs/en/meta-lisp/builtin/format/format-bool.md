---
title: format-bool
---

# Type
```scheme
(-> bool-t string-t)
```

# Description
Format a boolean as an S-expression string.

# Examples
```scheme
(format-bool true)   ;; => "#t"
(format-bool false)  ;; => "#f"
```
