---
title: text-starts-with
---

# Type

```meta-lisp
(-> text-t text-t bool-t)
```

# Description

Check if a text starts with a specified prefix.

# Examples

```meta-lisp
(text-starts-with "hello" "he")  ;; => true
(text-starts-with "hello" "hi")  ;; => false
(text-starts-with "hello" "")    ;; => true
```
