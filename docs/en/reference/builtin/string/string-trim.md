---
title: string-trim
---

# Type

```scheme
(-> string-t string-t)
```

# Description

Remove all whitespace characters from both ends of a string.

# Examples

```scheme
(string-trim "  hello  ")  ;; => "hello"
(string-trim "hello")      ;; => "hello"
(string-trim "  ")         ;; => ""
```
