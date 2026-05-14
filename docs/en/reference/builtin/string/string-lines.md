---
title: string-lines
---

# Type

```scheme
(-> string-t (list-t string-t))
```

# Description

Split a string into lines by newline characters.

# Examples

```scheme
(string-lines "a\nb\nc")  ;; => ["a" "b" "c"]
(string-lines "abc")      ;; => ["abc"]
(string-lines "")         ;; => [""]
```
