---
title: text-include
---

# Type

```meta-lisp
(-> text-t text-t bool-t)
```

# Description

Check if a text includes a specified substring.

# Examples

```meta-lisp
(text-include "hello" "ell")  ;; => true
(text-include "hello" "xyz")  ;; => false
(text-include "hello" "")     ;; => true
```
