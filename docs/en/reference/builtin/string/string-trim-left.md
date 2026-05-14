---
title: string-trim-left
---

# Type

```scheme
(-> string-t string-t)
```

# Description

Remove whitespace from the left side of a string.

# Examples

```scheme
(string-trim-left "  hello")  ;; => "hello"
(string-trim-left "hello  ")  ;; => "hello  "
(string-trim-left "hello")    ;; => "hello"
```
