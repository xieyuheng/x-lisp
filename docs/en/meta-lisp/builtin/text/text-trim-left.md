---
title: text-trim-left
---

# Type

```meta-lisp
(-> text-t text-t)
```

# Description

Remove whitespace from the left side of a text.

# Examples

```meta-lisp
(text-trim-left "  hello")  ;; => "hello"
(text-trim-left "hello  ")  ;; => "hello  "
(text-trim-left "hello")    ;; => "hello"
```
