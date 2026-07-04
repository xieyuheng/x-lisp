---
title: string-trim-end
---

# Type

```meta-lisp
(-> string-t string-t)
```

# Description

Remove whitespace from the end of a string, same as `string-trim-right`.

# Examples

```meta-lisp
(string-trim-end "hello  ")  ;; => "hello"
(string-trim-end "  hello")  ;; => "  hello"
```
