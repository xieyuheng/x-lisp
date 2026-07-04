---
title: string-trim-start
---

# Type

```meta-lisp
(-> string-t string-t)
```

# Description

Remove whitespace from the start of a string, same as `string-trim-left`.

# Examples

```meta-lisp
(string-trim-start "  hello")  ;; => "hello"
(string-trim-start "hello  ")  ;; => "hello  "
```
