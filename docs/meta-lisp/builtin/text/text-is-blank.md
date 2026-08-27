---
title: text-is-blank
---

# Type

```meta-lisp
(-> text-t bool-t)
```

# Description

Check if a text contains only whitespace characters.

# Examples

```meta-lisp
(text-is-blank "")     ;; => true
(text-is-blank "   ")  ;; => true
(text-is-blank " a ")  ;; => false
```
