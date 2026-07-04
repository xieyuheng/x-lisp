---
title: string-trim
---

# Type

```meta-lisp
(-> string-t string-t)
```

# Description

Remove all whitespace characters from both ends of a string.

# Examples

```meta-lisp
(string-trim "  hello  ")  ;; => "hello"
(string-trim "hello")      ;; => "hello"
(string-trim "  ")         ;; => ""
```
