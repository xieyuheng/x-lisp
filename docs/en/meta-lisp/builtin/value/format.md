---
title: format
---

# Type

```scheme
(polymorphic (A) (-> A string-t))
```

# Description

Format any value as a string representation.

# Examples

```scheme
(format 42)       ;; => "42"
(format "hello")  ;; => "\"hello\""
(format [1 2 3])  ;; => "[1 2 3]"
```
