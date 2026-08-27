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
(text-include "ell" "hello")  ;; => true
(text-include "xyz" "hello")  ;; => false
(text-include "" "hello")     ;; => true
```
