---
title: text-trim-start
---

# Type

```meta-lisp
(-> text-t text-t)
```

# Description

Remove whitespace from the start of a text, same as `text-trim-left`.

# Examples

```meta-lisp
(text-trim-start "  hello")  ;; => "hello"
(text-trim-start "hello  ")  ;; => "hello  "
```
