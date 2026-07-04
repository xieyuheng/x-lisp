---
title: string-trim-left
---

# Type

```meta-lisp
(-> string-t string-t)
```

# Description

Remove whitespace from the left side of a string.

# Examples

```meta-lisp
(string-trim-left "  hello")  ;; => "hello"
(string-trim-left "hello  ")  ;; => "hello  "
(string-trim-left "hello")    ;; => "hello"
```
