---
title: text-chars
---

# Type

```meta-lisp
(-> text-t (list-t text-t))
```

# Description

Split a text into a list of single-character strings.

# Examples

```meta-lisp
(text-chars "abc")   ;; => (@list "a" "b" "c")
(text-chars "")      ;; => (@list)
(text-chars "你好")  ;; => (@list "你" "好")
```
