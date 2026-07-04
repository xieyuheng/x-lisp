---
title: format-bool
---

# Type
```meta-lisp
(-> bool-t string-t)
```

# Description
Format a boolean as an S-expression string.

# Examples
```meta-lisp
(format-bool true)   ;; => "#t"
(format-bool false)  ;; => "#f"
```
