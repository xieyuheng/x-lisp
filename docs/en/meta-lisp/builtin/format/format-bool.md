---
title: format-bool
---

# Type
```meta-lisp
(-> bool-t text-t)
```

# Description
Format a boolean as an S-expression text.

# Examples
```meta-lisp
(format-bool true)   ;; => "#t"
(format-bool false)  ;; => "#f"
```
