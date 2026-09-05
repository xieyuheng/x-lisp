---
title: text-lines
---

# Type

```meta-lisp
(-> text-t (list-t text-t))
```

# Description

Split a text into lines by newline characters.

# Examples

```meta-lisp
(text-lines "a\nb\nc")  ;; => (@list "a" "b" "c")
(text-lines "abc")      ;; => (@list "abc")
(text-lines "")         ;; => (@list "")
```
