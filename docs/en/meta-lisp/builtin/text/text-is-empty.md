---
title: text-is-empty
---

# Type

```meta-lisp
(-> text-t bool-t)
```

# Description

Check if a text is empty (length 0).

# Examples

```meta-lisp
(text-is-empty "")       ;; => true
(text-is-empty "hello")  ;; => false
```
