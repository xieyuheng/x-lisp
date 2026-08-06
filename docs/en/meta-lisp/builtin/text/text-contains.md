---
title: text-contains
---

# Type

```meta-lisp
(-> text-t text-t bool-t)
```

# Description

Check if a text contains a specified substring.

# Examples

```meta-lisp
(text-contains "hello" "ell")  ;; => true
(text-contains "hello" "xyz")  ;; => false
(text-contains "hello" "")     ;; => true
```
