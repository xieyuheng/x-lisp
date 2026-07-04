---
title: string-trim-right
---

# Type

```scheme
(-> string-t string-t)
```

# Description

Remove whitespace from the right side of a string.

# Examples

```scheme
(string-trim-right "hello  ")  ;; => "hello"
(string-trim-right "  hello")  ;; => "  hello"
(string-trim-right "hello")    ;; => "hello"
```
