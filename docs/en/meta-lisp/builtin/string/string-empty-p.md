---
title: string-empty?
---

# Type

```meta-lisp
(-> string-t bool-t)
```

# Description

Check if a string is empty (length 0).

# Examples

```meta-lisp
(string-empty? "")       ;; => true
(string-empty? "hello")  ;; => false
```
