---
title: format
---

# Type

```meta-lisp
(all (A) (-> A text-t))
```

# Description

Format any value as a text representation.

# Examples

```meta-lisp
(format 42)       ;; => "42"
(format "hello")  ;; => "\"hello\""
(format (@list 1 2 3))  ;; => "(@list 1 2 3)"
```
