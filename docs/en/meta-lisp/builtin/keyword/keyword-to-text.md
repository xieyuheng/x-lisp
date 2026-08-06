---
title: keyword-to-text
---

# Type

```meta-lisp
(-> keyword-t text-t)
```

# Description

Convert a keyword to a text (including the `:` prefix).

# Examples

```meta-lisp
(keyword-to-text :key)   ;; => ":key"
(keyword-to-text :name)  ;; => ":name"
```
