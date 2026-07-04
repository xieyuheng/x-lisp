---
title: string-length
---

# Type

```scheme
(-> string-t int-t)
```

# Description

Return the number of characters in a string (in Unicode scalar values).

# Examples

```scheme
(string-length "hello")  ;; => 5
(string-length "")       ;; => 0
(string-length "你好")   ;; => 2
```
