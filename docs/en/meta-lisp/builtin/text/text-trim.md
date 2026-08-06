---
title: text-trim
---

# Type

```meta-lisp
(-> text-t text-t)
```

# Description

Remove all whitespace characters from both ends of a text.

# Examples

```meta-lisp
(text-trim "  hello  ")  ;; => "hello"
(text-trim "hello")      ;; => "hello"
(text-trim "  ")         ;; => ""
```
