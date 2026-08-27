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
(text-chars "abc")   ;; => ["a" "b" "c"]
(text-chars "")      ;; => []
(text-chars "你好")  ;; => ["你" "好"]
```
