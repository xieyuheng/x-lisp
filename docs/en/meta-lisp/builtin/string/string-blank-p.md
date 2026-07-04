---
title: string-blank?
---

# Type

```meta-lisp
(-> string-t bool-t)
```

# Description

Check if a string contains only whitespace characters.

# Examples

```meta-lisp
(string-blank? "")     ;; => true
(string-blank? "   ")  ;; => true
(string-blank? " a ")  ;; => false
```
