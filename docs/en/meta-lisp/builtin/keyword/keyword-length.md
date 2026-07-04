---
title: keyword-length
---

# Type

```meta-lisp
(-> keyword-t int-t)
```

# Description

Return the length of the keyword name (excluding the `:` prefix).

# Examples

```meta-lisp
(keyword-length :key)      ;; => 3
(keyword-length :name)     ;; => 4
```
