---
title: string-trim-end
---

# Type

```scheme
(-> string-t string-t)
```

# Description

Remove whitespace from the end of a string, same as `string-trim-right`.

# Examples

```scheme
(string-trim-end "hello  ")  ;; => "hello"
(string-trim-end "  hello")  ;; => "  hello"
```
