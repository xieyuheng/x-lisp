---
title: format
---

# Type

```meta-lisp
(polymorphic (A) (-> A text-t))
```

# Description

Format any value as a text representation.

# Examples

```meta-lisp
(format 42)       ;; => "42"
(format "hello")  ;; => "\"hello\""
(format [1 2 3])  ;; => "[1 2 3]"
```
