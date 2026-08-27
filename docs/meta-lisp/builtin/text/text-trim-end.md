---
title: text-trim-end
---

# Type

```meta-lisp
(-> text-t text-t)
```

# Description

Remove whitespace from the end of a text, same as `text-trim-right`.

# Examples

```meta-lisp
(text-trim-end "hello  ")  ;; => "hello"
(text-trim-end "  hello")  ;; => "  hello"
```
