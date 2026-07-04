---
title: keyword-to-string
---

# Type

```meta-lisp
(-> keyword-t string-t)
```

# Description

Convert a keyword to a string (including the `:` prefix).

# Examples

```meta-lisp
(keyword-to-string :key)   ;; => ":key"
(keyword-to-string :name)  ;; => ":name"
```
