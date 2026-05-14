---
title: keyword-to-string
---

# Type

```scheme
(-> keyword-t string-t)
```

# Description

Convert a keyword to a string (including the `:` prefix).

# Examples

```scheme
(keyword-to-string :key)   ;; => ":key"
(keyword-to-string :name)  ;; => ":name"
```
