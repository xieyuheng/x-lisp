---
title: string-blank?
---

# Type

```scheme
(-> string-t bool-t)
```

# Description

Check if a string contains only whitespace characters.

# Examples

```scheme
(string-blank? "")     ;; => true
(string-blank? "   ")  ;; => true
(string-blank? " a ")  ;; => false
```
