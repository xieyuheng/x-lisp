---
title: string-length
---

# Type

```meta-lisp
(-> string-t int-t)
```

# Description

Return the number of characters in a string (in Unicode scalar values).

# Examples

```meta-lisp
(string-length "hello")  ;; => 5
(string-length "")       ;; => 0
(string-length "你好")   ;; => 2
```
