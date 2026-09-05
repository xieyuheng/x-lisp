---
title: text-join
---

# Type

```meta-lisp
(-> text-t (list-t text-t) text-t)
```

# Description

Join a list of strings with a delimiter, the inverse of `text-split`.

# Examples

```meta-lisp
(text-join "," (@list "a" "b" "c"))  ;; => "a,b,c"
(text-join " " (@list "a" "b"))      ;; => "a b"
(text-join "" (@list "a" "b"))       ;; => "ab"
```
