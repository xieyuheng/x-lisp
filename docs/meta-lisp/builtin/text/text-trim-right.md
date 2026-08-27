---
title: text-trim-right
---

# Type

```meta-lisp
(-> text-t text-t)
```

# Description

Remove whitespace from the right side of a text.

# Examples

```meta-lisp
(text-trim-right "hello  ")  ;; => "hello"
(text-trim-right "  hello")  ;; => "  hello"
(text-trim-right "hello")    ;; => "hello"
```
