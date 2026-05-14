---
title: keyword-length
---

# Type

```scheme
(-> keyword-t int-t)
```

# Description

Return the length of the keyword name (excluding the `:` prefix).

# Examples

```scheme
(keyword-length :key)      ;; => 3
(keyword-length :name)     ;; => 4
```
