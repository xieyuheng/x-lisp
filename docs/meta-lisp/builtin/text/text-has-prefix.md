---
title: text-has-prefix
---

# Type

```meta-lisp
(-> text-t text-t bool-t)
```

# Description

Check if a text has a specified prefix.

# Examples

```meta-lisp
(text-has-prefix "hello" "he")  ;; => true
(text-has-prefix "hello" "hi")  ;; => false
(text-has-prefix "hello" "")    ;; => true
```
