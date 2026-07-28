---
title: string-contains
---

# Type

```meta-lisp
(-> string-t string-t bool-t)
```

# Description

Check if a string contains a specified substring.

# Examples

```meta-lisp
(string-contains "hello" "ell")  ;; => true
(string-contains "hello" "xyz")  ;; => false
(string-contains "hello" "")     ;; => true
```
