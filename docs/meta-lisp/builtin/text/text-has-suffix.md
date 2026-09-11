---
title: text-has-suffix
---

# Type

```meta-lisp
(-> text-t text-t bool-t)
```

# Description

Check if a text has a specified suffix.

# Examples

```meta-lisp
(text-has-suffix "hello" "lo")  ;; => true
(text-has-suffix "hello" "hi")  ;; => false
(text-has-suffix "hello" "")    ;; => true
```
