---
title: format-float
---

# Type
```meta-lisp
(-> float-t string-t)
```

# Description
Format a float as an S-expression string.

# Examples
```meta-lisp
(format-float 42.0)  ;; => "42.0"
(format-float 0.0)   ;; => "0.0"
```
