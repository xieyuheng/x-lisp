---
title: string-is-blank
---

# Type

```meta-lisp
(-> string-t bool-t)
```

# Description

Check if a string contains only whitespace characters.

# Examples

```meta-lisp
(string-is-blank "")     ;; => true
(string-is-blank "   ")  ;; => true
(string-is-blank " a ")  ;; => false
```
