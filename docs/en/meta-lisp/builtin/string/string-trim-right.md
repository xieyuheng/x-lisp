---
title: string-trim-right
---

# Type

```meta-lisp
(-> string-t string-t)
```

# Description

Remove whitespace from the right side of a string.

# Examples

```meta-lisp
(string-trim-right "hello  ")  ;; => "hello"
(string-trim-right "  hello")  ;; => "  hello"
(string-trim-right "hello")    ;; => "hello"
```
