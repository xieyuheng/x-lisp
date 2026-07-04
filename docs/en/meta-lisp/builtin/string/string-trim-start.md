---
title: string-trim-start
---

# Type

```scheme
(-> string-t string-t)
```

# Description

Remove whitespace from the start of a string, same as `string-trim-left`.

# Examples

```scheme
(string-trim-start "  hello")  ;; => "hello"
(string-trim-start "hello  ")  ;; => "hello  "
```
