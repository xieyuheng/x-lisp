---
title: string-lines
---

# Type

```meta-lisp
(-> string-t (list-t string-t))
```

# Description

Split a string into lines by newline characters.

# Examples

```meta-lisp
(string-lines "a\nb\nc")  ;; => ["a" "b" "c"]
(string-lines "abc")      ;; => ["abc"]
(string-lines "")         ;; => [""]
```
